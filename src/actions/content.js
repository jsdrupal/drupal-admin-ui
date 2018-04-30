import {
  put,
  call,
  takeLatest,
  race,
  take,
  cancelled,
} from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';

import { setMessage } from './application';

export const CONTENT_REQUESTED = 'CONTENT_REQUESTED';
export const requestContent = options => ({
  type: CONTENT_REQUESTED,
  payload: { options },
});

export const CONTENT_FILTER_UPDATED = 'CONTENT_FILTER_UPDATED';
export const CONTENT_LOADED = 'CONTENT_LOADED';
function* loadContent({ payload: { options } }) {
  try {
    const queryString = {
      sort: options.sort || '',
      filter: {
        ...(options.types && Object.keys(options.types).length
          ? options.types.reduce(
              (acc, cur) => ({
                ...acc,
                [`type${cur}`]: {
                  condition: {
                    value: cur,
                    path: 'type',
                    memberOf: 'typeGroup',
                  },
                },
              }),
              { typeGroup: { group: { conjunction: 'OR' } } },
            )
          : {}),
        ...(options.published && Object.keys(options.published).length
          ? options.published.reduce(
              (acc, cur) => ({
                ...acc,
                [`type${cur}`]: {
                  condition: {
                    value: cur,
                    path: 'status',
                    memberOf: 'publishedGroup',
                  },
                },
              }),
              { publishedGroup: { group: { conjunction: 'OR' } } },
            )
          : {}),
      },
    };
    yield put(resetLoading());
    yield put(showLoading());

    yield put({
      type: CONTENT_FILTER_UPDATED,
      payload: {
        options,
      },
    });

    const nodeTypes = yield call(api, 'nodeType');
    const nodes = yield call(api, 'content', { queryString });

    yield put({
      type: CONTENT_LOADED,
      payload: {
        nodes,
        nodeTypes,
      },
    });
  } catch (error) {
    yield put(setMessage(error.toString()));
  } finally {
    yield put(hideLoading());
    if (yield cancelled()) {
      // do a thing
    }
  }
}

export const watchRequestedContentWithCancel = function* watchRequestedContent() {
  const { cancel } = yield race({
    task: takeLatest(CONTENT_REQUESTED, loadContent),
    cancel: take('CANCEL_TASK'),
  });
  if (cancel) {
    // do a thing.
  }
};
