import { put, call, takeLatest } from 'redux-saga/effects';
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
  const sort = (action.payload.options && action.payload.options.sort) || null;

  try {
    yield put(resetLoading());
    yield put(showLoading());

    const queryString = {
      filter: {},
    };

    if (sort) {
      const { name, path, direction } = sort;
      queryString.sort = { [`sort-${name}`]: { path, direction } };
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

export default function* rootSaga() {
  yield takeLatest(CONTENT_REQUESTED, loadContent);
}
