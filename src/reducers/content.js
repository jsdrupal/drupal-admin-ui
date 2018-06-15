import {
  CONTENT_LOADED,
  CONTENT_DELETE,
  CONTENT_SAVE,
} from '../actions/content';

export const initialState = {
  contentList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTENT_LOADED: {
      return {
        ...state,
        // Group JSON API includes by their type.
        includes: action.payload.contentList.included.reduce(
          (accumulator, node) => {
            accumulator[node.type] = accumulator[node.type] || {};
            accumulator[node.type][node.id] = node;
            return accumulator;
          },
          {},
        ),
        contentList: action.payload.contentList.data
          ? action.payload.contentList.data.map(content => ({
              ...content,
              // @fixme Instead of doing that we should get the node type
              // using the type relationship.
              type: content.type.substr(6),
            }))
          : [],
      };
    }

    case CONTENT_DELETE: {
      return {
        ...state,
        contentList: state.contentList.filter(
          content => content.id !== action.payload.content.id,
        ),
      };
    }

    default: {
      return { ...state };
    }
  }
};
