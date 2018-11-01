import { Action } from '../actions/action';
import { ACTION_TYPE } from '../constants/action_type';

export const initialState = {
  taxonomyVocabulary: [],
  taxonomyTerms: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.TAXONOMY_VOCABULARY_LOADED: {
      return {
        ...state,
        taxonomyVocabulary: action.payload.taxonomyVocabulary,
      };
    }
    case ACTION_TYPE.TAXONOMY_TERMS_LOADED: {
      const { vocabulary, taxonomyTerms } = action.payload;
      return {
        ...state,
        taxonomyTerms: {
          ...state.taxonomyTerms,
          // @ts-ignore
          [vocabulary]: taxonomyTerms,
        },
      };
    }
    default:
      return state;
  }
};
