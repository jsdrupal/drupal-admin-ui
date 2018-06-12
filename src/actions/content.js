import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';

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
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const queryString = {
      sort: {
        'sort-changed': {
          path: 'changed',
          direction: 'DESC',
        },
      },
      filter: {},
    };
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
    yield put(setMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}
export const ACTION_EXECUTE = 'ACTION_EXECUTE';
export const actionExecute = (action, nids) => {
  return {
    type: ACTION_EXECUTE,
    payload: {
      action,
      nids,
    },
  };
};

export const KNOWN_ACTIONS = [
  'entity:delete_action:node',
  'node_make_sticky_action',
  'node_make_unsticky_action',
  'node_promote_action',
  'entity:publish_action:node',
  'node_unpromote_action',
  'entity:unpublish_action:node',
];

// @todo Find a better name
export function* doActionExecute({ payload: { action, nids } }) {
  try {
    const contentList = yield select(state => state.content.contentList);
    const actions = nids
      .map(nid => {
        const node = contentList.filter(
          contentItem => contentItem.attributes.nid == nid,
        )[0];

        let saveAction;
        switch (action.attributes.plugin) {
          case 'entity:delete_action:node':
            saveAction = call(api, 'node:delete', { parameters: { node } });
            break;
          case 'node_make_sticky_action':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    sticky: true,
                  },
                  links: node.links,
                },
              },
            });
            break;
          case 'node_make_unsticky_action':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    sticky: false,
                  },
                  links: node.links,
                },
              },
            });
            break;
          case 'node_promote_action':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    promote: true,
                  },
                  links: node.links,
                },
              },
            });
            break;
          case 'node_unpromote_action':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    promote: false,
                  },
                  links: node.links,
                },
              },
            });
            break;
          case 'entity:publish_action:node':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    status: true,
                  },
                  links: node.links,
                },
              },
            });
            break;
          case 'entity:unpublish_action:node':
            saveAction = call(api, 'node:save', {
              parameters: {
                node: {
                  id: node.id,
                  type: node.type,
                  attributes: {
                    status: false,
                  },
                  links: node.links,
                },
              },
            });
            break;
          default:
            break;
        }
        return saveAction;
      })
      .filter(x => x);
    const result = yield all(actions);
  } catch (error) {
    yield put(setMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(CONTENT_REQUESTED, loadContent);
  yield takeLatest(ACTION_EXECUTE, doActionExecute);
}
