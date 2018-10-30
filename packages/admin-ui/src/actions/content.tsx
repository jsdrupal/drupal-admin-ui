import * as React from 'react';
import {
  hideLoading,
  resetLoading,
  showLoading,
} from 'react-redux-loading-bar';
import { push } from 'react-router-redux';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import api from '../utils/api/api';

import {
  contentTypesSelector,
  requestContentTypes,
  setErrorMessage,
  setSuccessMessage,
} from './application';

import MessageSave from '../components/01_subatomics/MessageHelpers/MessageSave';
import { extractContentType, mapContentTypeToName } from '../utils/api/content';
import { ApiError } from '../utils/api/errors';

export interface Content {
    id: string,
    type: string,
    attributes: {
      promote?: boolean,
      sticky?: boolean,
      status?: boolean,
    },
    links: string[],
  };

// type ContentAction = {
//   attributes?: {
//     plugin: string,
//   },
//   payload: {
//     uid: string,
//     options?: {
//       contentTypes: Array<any>,
//       page?: {
//         offset: number,
//         limit: number,
//       },
//       status?: string,
//       sort?: {
//         path: string,
//         direction: string,
//       },
//       title?: string,
//     }
//   }
// }

export const CONTENT_REQUESTED = 'CONTENT_REQUESTED';
export const requestContent = (
  options = { contentTypes: [], status: null },
) => ({
  type: CONTENT_REQUESTED,
  payload: { options },
});

export const CONTENT_LOADED = 'CONTENT_LOADED';
function* loadContent(action: any) {
  const title =
    (action.payload.options && action.payload.options.title) || null;
  const contentTypes =
    (action.payload.options && action.payload.options.contentTypes) || [];
  const status =
    (action.payload.options && action.payload.options.status) || null;
  const sort = (action.payload.options && action.payload.options.sort) || null;
  const page = (action.payload.options && action.payload.options.page) || null;

  try {
    yield put(showLoading());

    const queryString = {
      filter: {},
      page: {},
      sort: {},
      include: {},
    };

    if (page) {
      const { offset, limit } = page;
      queryString.page = { offset, limit };
    }

    if (sort) {
      const { path, direction } = sort;
      queryString.sort = `${(direction === 'DESC' && '-') || ''}${path}`;
    }

    if (title && title.length) {
      queryString.filter = {
        ...queryString.filter,
        title: {
          path: 'title',
          operator: 'CONTAINS',
          value: title,
        },
      };
    }
    if (contentTypes.length) {
      queryString.filter = {
        ...queryString.filter,
        typeGroup: { group: { conjunction: 'OR' } },
        typearticle: {},
        typepage: {},
        ...contentTypes.reduce(
          (accumulator: any, contentType: string) => ({
            ...accumulator,
            [`type${contentType}`]: {
              condition: {
                value: contentType,
                path: 'type',
                memberOf: 'typeGroup',
              },
            },
          }),
          {},
        ),
      };
    }
    if (status && status.length) {
      queryString.filter = {
        ...queryString.filter,
        status: {
          value: status === 'published' ? 1 : 0,
        },
      };
    }

    queryString.include = 'uid';

    // Unset this, otherwise it'll send 'filter=' to JSON:API and cause an error.
    if (!Object.keys(queryString.filter).length) {
      delete queryString.filter;
    }

    const contentList = yield call(api, 'content', { queryString });
    yield put({
      type: CONTENT_LOADED,
      payload: {
        contentList,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const CONTENT_SINGLE_REQUESTED = 'CONTENT_SINGLE_REQUESTED';
export const requestSingleContent = (nid: string) => ({
  type: CONTENT_SINGLE_REQUESTED,
  payload: { nid },
});

export const CONTENT_SINGLE_LOADED = 'CONTENT_SINGLE_LOADED';
function* loadSingleContent(action: any) {
  const {
    payload: { nid },
  } = action;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const {
      data: [content],
    } = yield call(api, 'content', {
      queryString: {
        filter: { condition: { path: 'nid', value: nid } },
      },
    });

    yield put({
      type: CONTENT_SINGLE_LOADED,
      payload: {
        content,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const CONTENT_ADD_CHANGE = 'CONTENT_ADD_CHANGE';
export const contentAddChange = (bundle: string, entity: string) => ({
  type: CONTENT_ADD_CHANGE,
  payload: { bundle, entity },
});

export const CONTENT_EDIT_CHANGE = 'CONTENT_EDIT_CHANGE';
export const contentEditChange = (bundle: string, entity: string) => ({
  type: CONTENT_EDIT_CHANGE,
  payload: { bundle, entity },
});



export const CONTENT_SAVE = 'CONTENT_SAVE';
export const contentSave = (content: Content) => ({
  type: CONTENT_SAVE,
  payload: {
    content,
  },
});

export const CONTENT_ADD = 'CONTENT_ADD';
export const contentAdd = (content: Content, bundle: string) => ({
  type: CONTENT_ADD,
  payload: {
    content,
    bundle,
  },
});

export const CONTENT_DELETE = 'CONTENT_DELETE';
export const contentDelete = (content: Content) => ({
  type: CONTENT_DELETE,
  payload: {
    content,
  },
});

export const ACTION_EXECUTE = 'ACTION_EXECUTE';
export const actionExecute = (action: string, nids: string[]) => ({
  type: ACTION_EXECUTE,
  payload: {
    action,
    nids,
  },
});

export const SUPPORTED_ACTIONS = [
  'entity:delete_action:node',
  'node_make_sticky_action',
  'node_make_unsticky_action',
  'node_promote_action',
  'entity:publish_action:node',
  'node_unpromote_action',
  'entity:unpublish_action:node',
];

// type executeActionType = {
//   attributes: {
//     plugin: string,
//   }
// };

// @todo How do we update the store with the new values of the nodes
//    or the deleted nodes, see https://github.com/jsdrupal/drupal-admin-ui/issues/131
// @todo Once jsonapi supports bulk operations, leverage it.
export function* executeAction(
{ payload: { action, nids} }: any) {
  try {
    const contentList = yield select((state: {content:{contentList: string[]}}) => state.content.contentList);
    const actions = nids
      .map((nid: string) => {
        const node = contentList.filter(
          (contentItem:{attributes:{nid: string}}) => String(contentItem.attributes.nid) === nid,
        )[0];

        let saveAction;
        switch (action.attributes.plugin) {
          case 'entity:delete_action:node':
            saveAction = put(contentDelete(node));
            break;
          case 'node_make_sticky_action':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  sticky: true,
                },
                links: node.links,
              }),
            );
            break;
          case 'node_make_unsticky_action':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  sticky: false,
                },
                links: node.links,
              }),
            );
            break;
          case 'node_promote_action':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  promote: true,
                },
                links: node.links,
              }),
            );
            break;
          case 'node_unpromote_action':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  promote: false,
                },
                links: node.links,
              }),
            );
            break;
          case 'entity:publish_action:node':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  status: true,
                },
                links: node.links,
              }),
            );
            break;
          case 'entity:unpublish_action:node':
            saveAction = put(
              contentSave({
                id: node.id,
                type: node.type,
                attributes: {
                  status: false,
                },
                links: node.links,
              }),
            );
            break;
          default:
            break;
        }
        return saveAction;
      })
      .filter((x:any) => x);
    yield all(actions);
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

function* saveContent({ payload: { content } } :any) {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const [
      {
        data: {
          attributes: { title, nid },
        },
      },
    ] = yield all([
      api('node:save', { parameters: { node: content } }),
      put(requestContentTypes()),
    ]);

    // Get the content types from the redux state
    const contentTypes = yield select(contentTypesSelector);
    // Extract the content type from the content data
    const contentType = extractContentType(content);

    // Map the content type to the human-readable name
    const contentTypeName =
      mapContentTypeToName(contentTypes, contentType) || 'unknown';

    yield put(
      setSuccessMessage(
        <MessageSave bundle={contentTypeName} title={title} nid={nid} />,
      ),
    );
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

function* addContent({ payload: { content } }: any) {
  try {
    yield put(resetLoading());
    yield put(showLoading());

    yield all([
      call(api, 'node:add', { parameters: { node: content } }),
      put(requestContentTypes()),
    ]);

    // Get the content types from the redux state
    const contentTypes = yield select(contentTypesSelector);
    // Extract the content type from the content data
    const contentType = extractContentType(content);
    // Map the content type to the human-readable name
    const contentName =
      mapContentTypeToName(contentTypes, contentType) || 'unknown';

    yield put(push('/admin/content'));
    yield put(setSuccessMessage(`New ${contentName} added successfully`));
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

function* deleteContent({ payload: { content } }: any) {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    yield call(api, 'node:delete', { parameters: { node: content } });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const USER_REQUESTED = 'USER_REQUESTED';
export const requestUser = (uid: string) => ({
  type: USER_REQUESTED,
  payload: { uid },
});

export const USER_LOADED = 'USER_LOADED';
function* loadUser(action: any) {
  const {
    payload: { uid },
  } = action;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const {
      data: [user],
    } = yield call(api, 'user', {
      queryString: {
        filter: { condition: { path: 'uid', value: uid } },
      },
    });

    yield put({
      type: USER_LOADED,
      payload: {
        user,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(CONTENT_REQUESTED, loadContent);
  yield takeEvery(CONTENT_SAVE, saveContent);
  yield takeLatest(CONTENT_SINGLE_REQUESTED, loadSingleContent);
  yield takeEvery(ACTION_EXECUTE, executeAction);
  yield takeLatest(CONTENT_ADD, addContent);
  yield takeEvery(CONTENT_DELETE, deleteContent);
  yield takeLatest(USER_REQUESTED, loadUser);
}