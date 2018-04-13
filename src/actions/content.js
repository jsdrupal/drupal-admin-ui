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
export const requestContent = () => ({
  type: CONTENT_REQUESTED,
  payload: {},
});

export const CONTENT_LOADED = 'CONTENT_LOADED';
function* loadContent() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const nodes = yield call(api, 'content');
    yield put({
      type: CONTENT_LOADED,
      payload: {
        nodes,
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
