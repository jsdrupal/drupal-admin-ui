import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import { api, ApiError } from '@drupal/admin-ui-utilities';
import { setErrorMessage } from './application';

const { REACT_APP_DRUPAL_BASE_URL } = process.env;

export const DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST';
export const requestDblogCollection = options => ({
  type: DBLOG_COLLECTION_REQUEST,
  payload: { options },
});

export const DBLOG_FILTER_UPDATED = 'DBLOG_FILTER_UPDATED';

export const DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED';
export function* loadDblog({ payload: { options } }) {
  try {
    const queryString = {
      sort: options.sort || '',
      page: {
        limit: 50,
        ...(options.offset
          ? {
              offset: options.offset,
            }
          : {}),
      },
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
    const dbLogEntriesTypes = yield call(
      api,
      REACT_APP_DRUPAL_BASE_URL,
      'dblog:types',
    );
    const dbLogEntries = yield call(api, REACT_APP_DRUPAL_BASE_URL, 'dblog', {
      queryString,
    });
    yield put({
      type: DBLOG_COLLECTION_LOADED,
      payload: {
        dbLogEntries,
        dbLogEntriesTypes,
      },
    });
  } catch (error) {
    const errorMessage = yield call(ApiError.errorToHumanString, error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const watchDblogRequests = function* watchDblogRequests() {
  yield takeLatest(DBLOG_COLLECTION_REQUEST, loadDblog);
};
