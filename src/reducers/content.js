import { CONTENT_LOADED } from '../actions/content';

export const initialState = {
  contentList: [],
  links: {},
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
              type: content.type.substr(6),
            }))
          : [],
        links: action.payload.contentList.links,
      };
    }
    default: {
      return { ...state };
    }
  }
};
