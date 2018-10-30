import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';
import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_SUCCESS,
  MESSAGE_SEVERITY_INFO,
  MESSAGE_SEVERITY_WARNING,
} from '../constants/messages';
import { ApiError } from '../utils/api/errors';

interface StateType {
    application: {
      contentTypes: string,
      actions: string,
    };
}

export const OPEN_DRAWER: string = 'OPEN_DRAWER';
export const openDrawer = () => ({
  type: OPEN_DRAWER,
});

export const CLOSE_DRAWER: string = 'CLOSE_DRAWER';
export const closeDrawer = () => ({
  type: CLOSE_DRAWER,
});

export const SET_MESSAGE: string = 'SET_MESSAGE';

/**
 *
 * @param {string} message - the message content
 * @param {string} severity - the severity level of the message, one of the levels
 *  listed at constants/messages.js
 * @returns {{type: string, payload: {message: *, messageSeverity: *}}}
 */
export const setMessage = (message: string, messageSeverity: string) => ({
  type: SET_MESSAGE,
  payload: {
    message,
    messageSeverity,
  },
});

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_ERROR}}}
 */
export const setErrorMessage = (message: string) =>
  setMessage(message, MESSAGE_SEVERITY_ERROR);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_SUCCESS}}}
 */
export const setSuccessMessage = (message: string) =>
  setMessage(message, MESSAGE_SEVERITY_SUCCESS);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_INFO}}}
 */
export const setInfoMessage = (message: string) =>
  setMessage(message, MESSAGE_SEVERITY_INFO);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_WARNING}}}
 */
export const setWarningMessage = (message: string) =>
  setMessage(message, MESSAGE_SEVERITY_WARNING);

export const CLEAR_MESSAGE: string = 'CLEAR_MESSAGE';
export const clearMessage = (key: string) => ({
  type: CLEAR_MESSAGE,
  payload: {
    key,
  },
});

export const CLEAR_ALL_MESSAGES = 'CLEAR_MESSAGES';
export const clearAllMessages = () => ({
  type: CLEAR_ALL_MESSAGES,
  payload: {},
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
    if (process.env.REACT_APP_DRUPAL_BASE_URL!.includes('localhost')) {
      yield put(
        setErrorMessage(
          'Unable to access data from Drupal. Did you set REACT_APP_DRUPAL_BASE_URL to localhost instead of 127.0.0.1?',
        ),
      );
    }
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

/**
 * Gets all available content types.
 */
export const CONTENT_TYPES_REQUESTED = 'CONTENT_TYPES_REQUESTED';
export const requestContentTypes = () => ({
  type: CONTENT_TYPES_REQUESTED,
  payload: {},
});

export const contentTypesSelector = (state: StateType) => state.application.contentTypes;
export const CONTENT_TYPES_LOADED = 'CONTENT_TYPES_LOADED';
function* loadContentTypes() {
  try {
    const contentTypes = yield call(api, 'contentTypes');
    yield put({
      type: CONTENT_TYPES_LOADED,
      payload: {
        contentTypes,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

/**
 * Gets all available action types.
 */
export const ACTIONS_REQUESTED: string = 'ACTIONS_REQUESTED';
export const requestActions = () => ({
  type: ACTIONS_REQUESTED,
  payload: {},
});

export const getActionsCache = (state: StateType) => state.application.actions;
export const ACTIONS_LOADED: string = 'ACTIONS_LOADED';
function* loadActions() {
  try {
    let actions = { data: yield select(getActionsCache) };
    if (!Object.keys(actions.data).length) {
      actions = yield call(api, 'actions');
    }
    yield put({
      type: ACTIONS_LOADED,
      payload: {
        actions,
      },
    });
  } catch (error) {
    const errorMessage: string = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  }
}

export default function* watchRequestedMenu() {
  yield takeLatest(MENU_REQUESTED, loadMenu);
  yield takeLatest(CONTENT_TYPES_REQUESTED, loadContentTypes);
  yield takeEvery(ACTIONS_REQUESTED, loadActions);
}