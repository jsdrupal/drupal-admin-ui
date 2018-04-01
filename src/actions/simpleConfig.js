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
import { MESSAGE_SUCCESS, setMessage } from './application';
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

export const SIMPLE_CONFIG_POST_REQUESTED = 'SIMPLE_CONFIG_POST_REQUESTED';
export const requestSimpleConfigPost = (name, config) => ({
  type: SIMPLE_CONFIG_POST_REQUESTED,
  payload: { name, config },
});

export const SIMPLE_CONFIG_POSTED = 'SIMPLE_CONFIG_POSTED';
function* postSimpleConfig({ payload: { name, config } }) {
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const csrfToken = yield api('csrf_token');
    // @todo It feels like this should be moved into the api wrapper.
    yield api(
      'simple_config',
      { $name: name },
      {
        body: JSON.stringify(config),
        headers: {
          'content-type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        method: 'PATCH',
      },
    );
    yield put(setMessage('Changes have been saved', MESSAGE_SUCCESS));
    yield put({
      type: SIMPLE_CONFIG_POSTED,
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

export const watchPostedSimpleConfigWithCancel = function* watchPostedSimpleConfig() {
  const { cancel } = yield race({
    task: takeLatest(SIMPLE_CONFIG_POST_REQUESTED, postSimpleConfig),
    cancel: take('CANCEL_TASK'),
  });
  if (cancel) {
    // do a thing.
  }
};
