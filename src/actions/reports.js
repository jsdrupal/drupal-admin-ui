import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';
import { setMessage } from './application';

export const DBLOG_COLLECTION_REQUEST = 'DBLOG_COLLECTION_REQUEST';
export const requestDblogCollection = () => ({
  type: DBLOG_COLLECTION_REQUEST,
  payload: {},
});

export const DBLOG_COLLECTION_LOADED = 'DBLOG_COLLECTION_LOADED';
function* loadDblog() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const dbLogEntries = yield call(api, 'dblog');
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
