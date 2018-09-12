import { TAXONOMY_VOCABULARY_LOADED } from '../actions/taxonomy';

export const initialState = {
  taxonomyVocabulary: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TAXONOMY_VOCABULARY_LOADED: {
      return {
        ...state,
        taxonomyVocabulary: action.payload.taxonomyVocabulary,
      };
    }
    default:
      return state;
  }
};
