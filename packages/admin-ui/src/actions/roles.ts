import {
  hideLoading,
  resetLoading,
  showLoading,
} from 'react-redux-loading-bar';
import {
  call,
  cancelled,
  put,
  race,
  take,
  takeLatest,
} from 'redux-saga/effects';
import api from '../utils/api/api';

import { ApiError } from '../utils/api/errors';
import { setErrorMessage } from './application';

import { ACTION_TYPE } from '../constants/action_type';

export const requestRoles = () => ({
  type: ACTION_TYPE.ROLES_REQUESTED,
  payload: {},
});

function* loadRoles() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    // @ts-ignore
    const roles = yield call(api, 'roles');
    yield put({
      type: ACTION_TYPE.ROLES_LOADED,
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
    task: takeLatest(ACTION_TYPE.ROLES_REQUESTED, loadRoles),
    cancel: take(ACTION_TYPE.CANCEL_TASK),
  });
  if (cancel) {
    // do a thing.
  }
};
