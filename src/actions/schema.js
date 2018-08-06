import { put, takeLatest } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { MESSAGE_ERROR } from '../constants/messages';
import { setMessage } from './application';

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

    const [
      { data: fieldSchema },
      { data: formDisplaySchema },
      entitySchema,
    ] = yield Promise.all([
      api('field_schema', {
        queryString: {
          filter: { entity_type: entityTypeId, bundle, mode: 'default' },
        },
      }),
      api('form_display', {
        queryString: {
          filter: { targetEntityType: entityTypeId, bundle, mode: 'default' },
        },
      }),
      api('schema', {
        parameters: { entityTypeId, bundle },
        queryString: { _describes: 'api_json', _format: 'schema_json' },
      }),
    ]);

    yield put({
      type: SCHEMA_LOADED,
      payload: {
        entityTypeId,
        bundle,
        fieldSchema,
        formDisplaySchema,
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
}
