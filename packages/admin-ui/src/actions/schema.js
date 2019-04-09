import { put, call, takeLatest, all } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import { ApiError } from '@drupal/admin-ui-utilities';

import api from '../utils/api/api';
import { setErrorMessage } from './application';

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
    ] = yield all([
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
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
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
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const SCHEMA_BY_ENTITY_ID_REQUESTED = 'SCHEMA_BY_ENTITY_ID_REQUESTED';
export const requestSchemaByEntityId = ({ entityTypeId, entityId }) => ({
  type: SCHEMA_BY_ENTITY_ID_REQUESTED,
  payload: { entityTypeId, entityId },
});

export const SCHEMA_BY_ENTITY_ID_LOADED = 'SCHEMA_BY_ENTITY_ID_LOADED';
function* loadSchemaByEntityId(action) {
  const { entityTypeId, entityId } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const entitySchema = yield call(api, 'schema_by_id', {
      parameters: { entityTypeId, entityId },
    });

    yield put({
      type: SCHEMA_BY_ENTITY_ID_LOADED,
      payload: {
        entityTypeId,
        entityId,
        entitySchema,
      },
    });
  } catch (error) {
    yield put(setErrorMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(SCHEMA_REQUESTED, loadSchema);
  yield takeLatest(SCHEMA_BY_ENTITY_ID_REQUESTED, loadSchemaByEntityId);
  yield takeLatest(UI_SCHEMA_REQUESTED, loadUiSchema);
}
