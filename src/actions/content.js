import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { MESSAGE_ERROR } from '../constants/messages';
import { setMessage } from './application';

export const CONTENT_REQUESTED = 'CONTENT_REQUESTED';
export const requestContent = (
  options = { contentTypes: [], status: null },
) => ({
  type: CONTENT_REQUESTED,
  payload: { options },
});

export const CONTENT_LOADED = 'CONTENT_LOADED';
function* loadContent(action) {
  const title =
    (action.payload.options && action.payload.options.title) || null;
  const contentTypes =
    (action.payload.options && action.payload.options.contentTypes) || [];
  const status =
    (action.payload.options && action.payload.options.status) || null;
  const sort = (action.payload.options && action.payload.options.sort) || null;
  const page = (action.payload.options && action.payload.options.page) || null;

  try {
    yield put(resetLoading());
    yield put(showLoading());

    const queryString = {
      filter: {},
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
          (accumulator, contentType) => ({
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
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

export const CONTENT_SAVE = 'CONTENT_SAVE';
export const contentSave = content => ({
  type: CONTENT_SAVE,
  payload: {
    content,
  },
});

export const CONTENT_DELETE = 'CONTENT_DELETE';
export const contentDelete = content => ({
  type: CONTENT_DELETE,
  payload: {
    content,
  },
});

export const ACTION_EXECUTE = 'ACTION_EXECUTE';
export const actionExecute = (action, nids) => ({
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

// @todo How do we update the store with the new values of the nodes
//    or the deleted nodes, see https://github.com/jsdrupal/drupal-admin-ui/issues/131
// @todo Once jsonapi supports bulk operations, leverage it.
export function* executeAction({ payload: { action, nids } }) {
  try {
    const contentList = yield select(state => state.content.contentList);
    const actions = nids
      .map(nid => {
        const node = contentList.filter(
          contentItem => String(contentItem.attributes.nid) === nid,
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
      .filter(x => x);
    yield all(actions);
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

function* saveContent({ payload: { content } }) {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    yield call(api, 'node:save', { parameters: { node: content } });
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

function* deleteContent({ payload: { content } }) {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    yield call(api, 'node:delete', { parameters: { node: content } });
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(CONTENT_REQUESTED, loadContent);
  yield takeLatest(ACTION_EXECUTE, executeAction);
  yield takeLatest(CONTENT_SAVE, saveContent);
  yield takeLatest(CONTENT_DELETE, deleteContent);
}
