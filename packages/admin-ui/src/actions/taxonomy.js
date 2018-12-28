import { put, takeLatest, call, select } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';
import { ApiError } from '@drupal/admin-ui-utilities';

import api from '../utils/api/api';
import { setErrorMessage } from './application';

export const TAXONOMY_VOCABULARY_REQUESTED = 'TAXONOMY_VOCABULARY_REQUESTED';
export const requestTaxonomyVocabulary = () => ({
  type: TAXONOMY_VOCABULARY_REQUESTED,
  payload: {},
});

export const requestTaxonomyVocabularyById = vocabulary => ({
  type: TAXONOMY_VOCABULARY_REQUESTED,
  payload: { vocabulary },
});

export const TAXONOMY_VOCABULARY_LOADED = 'TAXONOMY_VOCABULARY_LOADED';
function* loadTaxonomyVocabulary(action) {
  try {
    yield put(resetLoading());
    yield put(showLoading());

    const { data: taxonomyVocabulary } = yield call(
      api,
      'taxonomy_vocabulary',
      {
        ...((action.payload.vocabulary && {
          queryString: {
            filter: {
              condition: { path: 'vid', value: action.payload.vocabulary },
            },
          },
        }) ||
          {}),
      },
    );

    yield put({
      type: TAXONOMY_VOCABULARY_LOADED,
      payload: {
        taxonomyVocabulary,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const TAXONOMY_TERMS_REQUESTED = 'TAXONOMY_TERMS_REQUESTED';
export const requestTaxonomyTerms = vocabulary => ({
  type: TAXONOMY_TERMS_REQUESTED,
  payload: { vocabulary },
});

export const getTaxonomyVocabularyById = (taxonomyVocabularyList, vocabulary) =>
  taxonomyVocabularyList
    .filter(({ attributes: { vid } }) => vid === vocabulary)
    .shift();

export const TAXONOMY_TERMS_LOADED = 'TAXONOMY_TERMS_LOADED';
function* loadTaxonomyTerms(action) {
  try {
    const {
      payload: { vocabulary },
    } = action;
    yield put(resetLoading());
    yield put(showLoading());

    const { data: taxonomyTerms } = yield call(api, 'taxonomy_term', {
      parameters: { type: vocabulary },
    });

    const {
      taxonomy: { taxonomyVocabulary },
    } = yield select();
    if (
      !(
        taxonomyVocabulary.length &&
        getTaxonomyVocabularyById(taxonomyVocabulary, vocabulary)
      )
    ) {
      yield put({
        type: TAXONOMY_VOCABULARY_REQUESTED,
        payload: {
          vocabulary,
        },
      });
    }

    yield put({
      type: TAXONOMY_TERMS_LOADED,
      payload: {
        vocabulary,
        taxonomyTerms,
      },
    });
  } catch (error) {
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export default function* rootSaga() {
  yield takeLatest(TAXONOMY_VOCABULARY_REQUESTED, loadTaxonomyVocabulary);
  yield takeLatest(TAXONOMY_TERMS_REQUESTED, loadTaxonomyTerms);
}
