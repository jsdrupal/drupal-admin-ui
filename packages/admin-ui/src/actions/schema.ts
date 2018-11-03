import {
  hideLoading,
  resetLoading,
  showLoading,
} from 'react-redux-loading-bar';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { ACTION_TYPE } from '../constants/action_type';

import api from '../utils/api/api';
import { ApiError } from '../utils/api/errors';
import { setErrorMessage } from './application';

export const requestUiSchema = ({ entityTypeId, bundle }: {entityTypeId: string, bundle: string}) => ({
  type: ACTION_TYPE.UI_SCHEMA_REQUESTED,
  payload: { entityTypeId, bundle },
});

function* loadUiSchema(action: any) {
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
      type: ACTION_TYPE.UI_SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        fieldSchema,
        formDisplaySchema,
        fieldStorageConfig,
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

export const requestSchema = ({ entityTypeId, bundle }: {entityTypeId: string, bundle: string}) => ({
  type: ACTION_TYPE.SCHEMA_REQUESTED,
  payload: { entityTypeId, bundle },
});

function* loadSchema(action: any) {
  const { entityTypeId, bundle } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const entitySchema = yield call(api, 'schema', {
      parameters: { entityTypeId, bundle },
      queryString: { _describes: 'api_json', _format: 'schema_json' },
    });

    yield put({
      type: ACTION_TYPE.SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        entitySchema,
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

export const requestSchemaByEntityId = ({ entityTypeId, entityId }: {entityTypeId: string, entityId: string}) => ({
  type: ACTION_TYPE.SCHEMA_BY_ENTITY_ID_REQUESTED,
  payload: { entityTypeId, entityId },
});

function* loadSchemaByEntityId(action: any) {
  const { entityTypeId, entityId } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const entitySchema = yield call(api, 'schema_by_id', {
      parameters: { entityTypeId, entityId },
    });

    yield put({
      type: ACTION_TYPE.SCHEMA_BY_ENTITY_ID_LOADED,
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
  yield takeLatest(ACTION_TYPE.SCHEMA_REQUESTED, loadSchema);
  yield takeLatest(ACTION_TYPE.SCHEMA_BY_ENTITY_ID_REQUESTED, loadSchemaByEntityId);
  yield takeLatest(ACTION_TYPE.UI_SCHEMA_REQUESTED, loadUiSchema);
}
