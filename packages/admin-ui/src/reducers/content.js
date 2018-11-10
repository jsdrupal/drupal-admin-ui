import {
  CONTENT_LOADED,
  CONTENT_SINGLE_LOADED,
  CONTENT_DELETE,
  CONTENT_ADD,
  CONTENT_ADD_CHANGE,
  USER_LOADED,
  CONTENT_EDIT_CHANGE,
} from '../actions/content';

export const initialState = {
  contentList: [],
  contentByNid: {},
  links: {},
  restorableContentAddByBundle: {},
  restorableContentEditById: {},
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTENT_SINGLE_LOADED:
      return {
        ...state,
        contentByNid: {
          [action.payload.content.attributes.nid]: action.payload.content,
        },
      };
    case CONTENT_ADD_CHANGE:
      return {
        ...state,
        restorableContentAddByBundle: {
          ...state.restorableContentAddByBundle,
          [action.payload.bundle]: action.payload.entity,
        },
      };
    case CONTENT_EDIT_CHANGE:
      return {
        ...state,
        restorableContentEditById: {
          ...state.restorableContentEditById,
          [action.payload.entity.id]: action.payload.entity,
        },
      };
    case CONTENT_ADD:
      return {
        ...state,
        restorableContentAddByBundle: {
          [action.payload.bundle]: null,
        },
      };
    case CONTENT_LOADED: {
      return {
        ...state,
        // Group JSON API includes by their type.
        includes: action.payload.contentList.included
          ? action.payload.contentList.included.reduce((accumulator, node) => {
              accumulator[node.type] = accumulator[node.type] || {};
              accumulator[node.type][node.id] = node;
              return accumulator;
            }, {})
          : {},
        contentList: action.payload.contentList.data
          ? action.payload.contentList.data.map(content => ({
              ...content,
              // @fixme Instead of doing that we should get the node type
              // using the type relationship.
              type: content.type.substr(6),
            }))
          : [],
        links: action.payload.contentList.links,
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

    case USER_LOADED: {
      return {
        ...state,
        user: action.payload.user,
      };
    }

    default:
      return state;
  }
};
