import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import qs from 'qs';
import api from '../utils/api/api';
import { setMessage } from './application';

export const DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST';
export const requestDblogCollection = options => ({
  type: DBLOG_COLLECTION_REQUEST,
  payload: { options },
});

export const DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED';
function* loadDblog({ payload: { options } }) {
  try {
    const queryString = qs.stringify(options, { arrayFormat: 'brackets' });
    yield put(resetLoading());
    yield put(showLoading());
    const dbLogEntries = yield call(api, 'dblog', { queryString });
    yield put({
      type: DBLOG_COLLECTION_LOADED,
      payload: {
        options,
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
