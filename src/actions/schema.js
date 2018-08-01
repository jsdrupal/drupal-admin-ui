import { put, call, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { MESSAGE_ERROR } from '../constants/messages';
import { setMessage } from './application';

// UI CONFIG SCHEMA
export const UI_CONFIG_SCHEMA_REQUESTED = 'UI_CONFIG_SCHEMA_REQUESTED';
export const requestUIConfigSchema = ({ entityTypeId, bundle }) => ({
  type: UI_CONFIG_SCHEMA_REQUESTED,
  payload: { entityTypeId, bundle },
});

export const UI_CONFIG_SCHEMA_LOADED = 'UI_CONFIG_SCHEMA_LOADED';
function* loadSchema(action) {
  const { entityTypeId, bundle } = action.payload;
  try {
    yield put(resetLoading());
    yield put(showLoading());
    const { data: fieldSchema } = yield call(api, 'field_schema', {
      parameters: { entityTypeId, bundle, mode: 'default' },
    });
    const { data: formDisplaySchema } = yield call(api, 'form_display', {
      queryString: {
        filter: { bundle, targetEntityType: entityTypeId, mode: 'default' },
      },
    });
    yield put({
      type: UI_CONFIG_SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        fieldSchema,
        formDisplaySchema,
      },
    });
  } catch (error) {
    yield put(setMessage(error.toString(), MESSAGE_ERROR));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(UI_CONFIG_SCHEMA_REQUESTED, loadSchema);
}
