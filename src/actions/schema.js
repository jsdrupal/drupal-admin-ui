import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { MESSAGE_ERROR } from '../constants/messages';
import { setMessage } from './application';

export const UI_SCHEMA_REQUESTED = 'UI_SCHEMA_REQUESTED';
export const requestUiSchema = ({ entityTypeId, bundle }) => ({
  type: UI_SCHEMA_REQUESTED,
  payload: { entityTypeId, bundle },
});

export const UI_SCHEMA_LOADED = 'UI_SCHEMA_LOADED';
function* loadUiSchema(action) {
  const { entityTypeId, bundle } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const [
      { data: fieldSchema },
      { data: formDisplaySchema },
      { data: fieldStorageConfig },
    ] = yield Promise.all([
      api('field_schema', {
        queryString: {
          filter: { entity_type: entityTypeId, bundle },
        },
      }),
      api('form_display', {
        queryString: {
          filter: { targetEntityType: entityTypeId, bundle, mode: 'default' },
        },
      }),
      api('field_storage_config', {
        queryString: {
          filter: { condition: { path: 'entity_type', value: entityTypeId } },
        },
      }),
    ]);

    yield put({
      type: UI_SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        fieldSchema,
        formDisplaySchema,
        fieldStorageConfig,
      },
    });
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

export const SCHEMA_REQUESTED = 'SCHEMA_REQUESTED';
export const requestSchema = ({ entityTypeId, bundle }) => ({
  type: SCHEMA_REQUESTED,
  payload: { entityTypeId, bundle },
});

export const SCHEMA_LOADED = 'SCHEMA_LOADED';
function* loadSchema(action) {
  const { entityTypeId, bundle } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const entitySchema = yield call(api, 'schema', {
      parameters: { entityTypeId, bundle },
      queryString: { _describes: 'api_json', _format: 'schema_json' },
    });

    yield put({
      type: SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        entitySchema,
      },
    });
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(SCHEMA_REQUESTED, loadSchema);
  yield takeLatest(UI_SCHEMA_REQUESTED, loadUiSchema);
}
