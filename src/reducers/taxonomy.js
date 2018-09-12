import {
  TAXONOMY_VOCABULARY_LOADED,
  TAXONOMY_TERMS_LOADED,
} from '../actions/taxonomy';

export const initialState = {
  taxonomyVocabulary: [],
  taxonomyTerms: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TAXONOMY_VOCABULARY_LOADED: {
      return {
        ...state,
        taxonomyVocabulary: action.payload.taxonomyVocabulary,
      };
    }
    case TAXONOMY_TERMS_LOADED: {
      const { taxonomyVocabulary, taxonomyTerms } = action.payload;
      return {
        ...state,
        taxonomyTerms: {
          ...state.taxonomyTerms,
          [taxonomyVocabulary]: taxonomyTerms,
        },
      };
    }
    default:
      return state;
  }
};
