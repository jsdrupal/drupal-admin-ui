import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';
import { setMessage } from './application';

export const DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST';
export const requestDblogCollection = options => ({
  type: DBLOG_COLLECTION_REQUEST,
  payload: { options },
});

export const DBLOG_FILTER_UPDATED = 'DBLOG_FILTER_UPDATED';

export const DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED';
function* loadDblog({ payload: { options } }) {
  try {
    const queryString = {
      sort: options.sort,
      page: {
        limit: 50,
        ...(options.offset
          ? {
              offset: options.offset,
            }
          : {}),
      },
      filter: {
        ...(options.severities && Object.keys(options.severities).length
          ? options.severities.reduce(
              (acc, cur) => ({
                ...acc,
                [`severity${cur}`]: {
                  condition: {
                    value: cur,
                    path: 'severity',
                    memberOf: 'severityGroup',
                  },
                },
              }),
              {
                severityGroup: {
                  group: {
                    conjunction: 'OR',
                  },
                },
              },
            )
          : {}),
      },
    };
    yield put(resetLoading());
    yield put(showLoading());
    yield put({
      type: DBLOG_FILTER_UPDATED,
      payload: {
        options,
      },
    });
    const dbLogEntries = yield call(api, 'dblog', { queryString });
    yield put({
      type: DBLOG_COLLECTION_LOADED,
      payload: {
        dbLogEntries,
      },
    });
  } catch (error) {
    yield put(setMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}

export const watchDblogRequests = function* watchDblogRequests() {
  yield takeLatest(DBLOG_COLLECTION_REQUEST, loadDblog);
};
