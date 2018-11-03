import { put, takeLatest, call, select } from 'redux-saga/effects';
import {
  showLoading,
  hideLoading,
  resetLoading,
} from 'react-redux-loading-bar';

import api from '../utils/api/api';
import { ApiError } from '../utils/api/errors';
import { setErrorMessage } from './application';

export const TAXONOMY_VOCABULARY_REQUESTED = 'TAXONOMY_VOCABULARY_REQUESTED';
export const requestTaxonomyVocabulary = () => ({
  type: TAXONOMY_VOCABULARY_REQUESTED,
  payload: {},
});

export const requestTaxonomyVocabularyById = (vocabulary: any) => ({
  type: TAXONOMY_VOCABULARY_REQUESTED,
  payload: { vocabulary },
});

export const TAXONOMY_VOCABULARY_LOADED = 'TAXONOMY_VOCABULARY_LOADED';
function* loadTaxonomyVocabulary(action: any) {
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
    // @ts-ignore
    const errorMessage = yield ApiError.errorToHumanString(error);
    yield put(setErrorMessage(errorMessage));
  } finally {
    yield put(hideLoading());
  }
}

export const TAXONOMY_TERMS_REQUESTED = 'TAXONOMY_TERMS_REQUESTED';
export const requestTaxonomyTerms = (vocabulary: any) => ({
  type: TAXONOMY_TERMS_REQUESTED,
  payload: { vocabulary },
});

export const getTaxonomyVocabularyById = (
  taxonomyVocabularyList: Array<{attributes: {vid: string}}>,
  vocabulary: string,
) =>
  taxonomyVocabularyList
    .filter(({ attributes: { vid } }) => vid === vocabulary)
    .shift();

export const TAXONOMY_TERMS_LOADED = 'TAXONOMY_TERMS_LOADED';
function* loadTaxonomyTerms(action: any) {
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
    // @ts-ignore
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
