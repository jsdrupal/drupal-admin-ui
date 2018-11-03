import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import api from '../utils/api/api';
import { MESSAGE_SEVERITY } from '../constants/message_severity';

import { ApiError } from '../utils/api/errors';

import { ACTION_TYPE } from '../constants/action_type';
import { Action } from '../actions/action';

interface State {
    application: {
      contentTypes: string,
      actions: ACTION_TYPE,
    };
}

export const openDrawer = () => ({
  type: ACTION_TYPE.OPEN_DRAWER,
});

export const closeDrawer = () => ({
  type: ACTION_TYPE.CLOSE_DRAWER,
});

/**
 *
 * @param {string} message - the message content
 * @param {string} severity - the severity level of the message, one of the levels
 *  listed at constants/message_severity.js
 * @returns {{type: string, payload: {message: *, messageSeverity: *}}}
 */
export const setMessage = (message: string | JSX.Element, messageSeverity: MESSAGE_SEVERITY) => ({
  type: ACTION_TYPE.SET_MESSAGE,
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
export const setErrorMessage = (message: string | JSX.Element) =>
  setMessage(message, MESSAGE_SEVERITY.ERROR);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_SUCCESS}}}
 */
export const setSuccessMessage = (message: string | JSX.Element) =>
  setMessage(message, MESSAGE_SEVERITY.SUCCESS);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_INFO}}}
 */
export const setInfoMessage = (message: string | JSX.Element) =>
  setMessage(message, MESSAGE_SEVERITY.INFO);

/**
 * @param {string} message - the message content
 *
 * @returns {{type: string, payload: {message: *, messageSeverity: MESSAGE_SEVERITY_WARNING}}}
 */
export const setWarningMessage = (message: string | JSX.Element) =>
  setMessage(message, MESSAGE_SEVERITY.WARNING);

export const clearMessage = (key: string) => ({
  type: ACTION_TYPE.CLEAR_MESSAGE,
  payload: {
    key,
  },
});

export const clearAllMessages = () => ({
  type: ACTION_TYPE.CLEAR_ALL_MESSAGES,
  payload: {},
});

export const requestMenu = () => ({
  type: ACTION_TYPE.MENU_REQUESTED,
  payload: {},
});

function* loadMenu() {
  try {
    yield put(resetLoading());
    yield put(showLoading());
    // @ts-ignore
    const menuLinks = yield call(api, 'menu');

    yield put({
      type: ACTION_TYPE.MENU_LOADED,
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
    // @ts-ignore
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

/**
 * Gets all available content types.
 */
export const requestContentTypes = () => ({
  type: ACTION_TYPE.CONTENT_TYPES_REQUESTED,
  payload: {},
});

export const contentTypesSelector = (state: State) => state.application.contentTypes;
export const CONTENT_TYPES_LOADED = 'CONTENT_TYPES_LOADED';
function* loadContentTypes() {
  try {
    // @ts-ignore
    const contentTypes = yield call(api, 'contentTypes');
    yield put({
      type: ACTION_TYPE.CONTENT_TYPES_LOADED,
      payload: {
        contentTypes,
      },
    });
  } catch (error) {
    // @ts-ignore
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

/**
 * Gets all available action types.
 */
export const requestActions = () => ({
  type: ACTION_TYPE.ACTIONS_REQUESTED,
  payload: {},
});

export const getActionsCache = (state: State) => state.application.actions;
function* loadActions() {
  try {
    // @ts-ignore
    let actions: { data: Action[]} = { data: yield select(getActionsCache) };
    if (!Object.keys(actions.data).length) {
      // ts-ignore
      actions = yield call(api, 'actions', {});
    }
    yield put({
      type: ACTION_TYPE.ACTIONS_LOADED,
      payload: {
        actions,
      },
    });
  } catch (error) {
    // @ts-ignore
    const errorMessage: string = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  }
}

export default function* watchRequestedMenu() {
  yield takeLatest(ACTION_TYPE.MENU_REQUESTED, loadMenu);
  yield takeLatest(ACTION_TYPE.CONTENT_TYPES_REQUESTED, loadContentTypes);
  yield takeEvery(ACTION_TYPE.ACTIONS_REQUESTED, loadActions);
}
