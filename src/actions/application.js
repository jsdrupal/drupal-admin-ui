import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';

export const SET_ERROR = 'SET_ERROR';
export const setError = error => ({
  type: SET_ERROR,
  payload: {
    error,
  },
});

export const MENU_REQUESTED = 'MENU_REQUESTED';
export const requestMenu = () => ({
  type: MENU_REQUESTED,
  payload: {},
});

export const MENU_LOADED = 'MENU_LOADED';
function* loadMenu() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const menuLinks = yield call(api, 'menu');
    yield put({
      type: MENU_LOADED,
      payload: {
        menuLinks,
      },
    });
  } catch (error) {
    yield put(setError(error));
  } finally {
    yield put(hideLoading());
  }
}

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
    yield put(setError(error));
  } finally {
    yield put(hideLoading());
  }
}

const watchRequestedRoles = function* watchRequestedRoles() {
  yield takeLatest(ROLES_REQUESTED, loadRoles);
};

const watchRequestedMenu = function* watchRequestedMenu() {
  yield takeLatest(MENU_REQUESTED, loadMenu);
};

export { watchRequestedRoles, watchRequestedMenu };
