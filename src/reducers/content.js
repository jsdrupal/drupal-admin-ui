import { CONTENT_LOADED } from '../actions/content';

export const initialState = {
  contentList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTENT_LOADED: {
      return {
        ...state,
        contentList: action.payload.contentList.data
          ? action.payload.contentList.data.map(content => ({
              ...content,
              type: content.type.substr(6),
            }))
          : [],
      };
    }
    default: {
      return { ...state };
    }
  }
};
