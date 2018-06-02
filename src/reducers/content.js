import { CONTENT_LOADED } from '../actions/content';

export const initialState = {
  nodes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTENT_LOADED: {
      return {
        ...state,
        nodes: action.payload.nodes.data
          ? action.payload.nodes.data.map(node => ({
              ...node,
              type: node.type.substr(6),
            }))
          : [],
      };
    }
    default: {
      return { ...state };
    }
  }
};
