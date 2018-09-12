import { put, takeLatest, call } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { setErrorMessage } from './application';

export const TAXONOMY_VOCABULARY_REQUESTED = 'TAXONOMY_VOCABULARY_REQUESTED';
export const requestTaxonomyVocabulary = () => ({
  type: TAXONOMY_VOCABULARY_REQUESTED,
  payload: {},
});

export const TAXONOMY_VOCABULARY_LOADED = 'TAXONOMY_VOCABULARY_LOADED';
function* loadTaxonomyVocabulary() {
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const { data: taxonomyVocabulary } = yield call(api, 'taxonomy_vocabulary');

    yield put({
      type: TAXONOMY_VOCABULARY_LOADED,
      payload: {
        taxonomyVocabulary,
      },
    });
  } catch (error) {
    yield put(setErrorMessage(error.toString()));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(TAXONOMY_VOCABULARY_REQUESTED, loadTaxonomyVocabulary);
}
