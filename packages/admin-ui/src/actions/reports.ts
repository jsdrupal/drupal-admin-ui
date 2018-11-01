import {
  hideLoading,
  resetLoading,
  showLoading,
} from 'react-redux-loading-bar';
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../utils/api/api';
import { ApiError } from '../utils/api/errors';
import { setErrorMessage } from './application';

export const enum ACTION_TYPE {
  DBLOG_FILTER_UPDATED = 'DBLOG_FILTER_UPDATED',
  DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED',
  DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST'
}

// export const DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST';
export const requestDblogCollection = (options: any) => ({
  type: ACTION_TYPE.DBLOG_COLLECTION_REQUEST,
  payload: { options },
});


// export const DBLOG_FILTER_UPDATED = 'DBLOG_FILTER_UPDATED';

// export const DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED';
export function* loadDblog({ payload: { options } }: any) {
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
              (acc: any, cur:string) => ({
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
              (acc: any, cur: string) => ({
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
      type: ACTION_TYPE.DBLOG_FILTER_UPDATED,
      payload: {
        options,
      },
    });
    const dbLogEntriesTypes = yield call(api, 'dblog:types');
    const dbLogEntries = yield call(api, 'dblog', { queryString });
    yield put({
      type: ACTION_TYPE.DBLOG_COLLECTION_LOADED,
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
  yield takeLatest(ACTION_TYPE.DBLOG_COLLECTION_REQUEST, loadDblog);
};
