import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';

export const SET_MESSAGE = 'SET_MESSAGE';
export const MESSAGE_ERROR = 'MESSAGE_ERROR';
export const MESSAGE_SUCCESS = 'MESSAGE_SUCCESS';

export const setMessage = (message, type = MESSAGE_ERROR) => ({
  type: SET_MESSAGE,
  payload: {
    message,
    type,
  },
});

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
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
    yield put(setMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}

export default function* watchRequestedMenu() {
  yield takeLatest(MENU_REQUESTED, loadMenu);
}
