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

export default function* watchRequestedMenu() {
  yield takeLatest(MENU_REQUESTED, loadMenu);
}
