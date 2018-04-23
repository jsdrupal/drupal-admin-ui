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

export const PERMISSIONS_REQUESTED = 'PERMISSIONS_REQUESTED';
export const requestPermissions = () => ({
  type: PERMISSIONS_REQUESTED,
  payload: {},
});

export const PERMISSIONS_LOADED = 'PERMISSIONS_LOADED';
function* loadPermissions() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const permissions = yield call(api, 'permissions');
    yield put({
      type: PERMISSIONS_LOADED,
      payload: {
        permissions,
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

export const watchRequestedPermissionsWithCancel = function* watchRequestedPermissions() {
  const { cancel } = yield race({
    task: takeLatest(PERMISSIONS_REQUESTED, loadPermissions),
    cancel: take('CANCEL_TASK'),
  });
  if (cancel) {
    // do a thing.
  }
};
