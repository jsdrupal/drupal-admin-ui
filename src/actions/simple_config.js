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
import { setMessage } from './application';
import api from '../utils/api/api';

export const SIMPLE_CONFIG_REQUESTED = 'SIMPLE_CONFIG_REQUESTED';
export const requestSimpleConfig = name => ({
  type: SIMPLE_CONFIG_REQUESTED,
  payload: { name },
});

export const SIMPLE_CONFIG_LOADED = 'SIMPLE_CONFIG_LOADED';
function* loadSimpleConfig({ payload: { name } }) {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const config = yield call(api, 'simple_config', { $name: name });
    yield put({
      type: SIMPLE_CONFIG_LOADED,
      payload: {
        name,
        config,
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

export const watchRequestedLoadSimpleConfigWithCancel = function* watchRequestedSimpleConfig() {
  const { cancel } = yield race({
    task: takeLatest(SIMPLE_CONFIG_REQUESTED, loadSimpleConfig),
    cancel: take('CANCEL_TASK'),
  });
  if (cancel) {
    // do a thing.
  }
};
