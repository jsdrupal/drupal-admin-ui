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
import { ApiError } from '@drupal/admin-ui-utilities';
import api from '../utils/api/api';

import { setErrorMessage } from './application';

export const ROLES_REQUESTED = 'ROLES_REQUESTED';
export const requestRoles = () => ({
  type: ROLES_REQUESTED,
  payload: {},
});

export const ROLES_LOADED = 'ROLES_LOADED';
function* loadRoles() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const roles = yield call(api, 'roles');
    yield put({
      type: ROLES_LOADED,
      payload: {
        roles,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
    if (yield cancelled()) {
      // do a thing
    }
  }
}

export const watchRequestedRolesWithCancel = function* watchRequestedRoles() {
  const { cancel } = yield race({
    task: takeLatest(ROLES_REQUESTED, loadRoles),
    cancel: take('CANCEL_TASK'),
  });
  if (cancel) {
    // do a thing.
  }
};
