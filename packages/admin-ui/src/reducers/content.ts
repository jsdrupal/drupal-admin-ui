import { Action } from '../actions/action';
import { ACTION_TYPE } from '../constants/action_type';
import { ContentType } from '../constants/content_type';

interface State {
  contentList: ContentType[];
  contentByNid: ContentType[];
  links: {

  };
  restorableContentAddByBundle: {};
  restorableContentEditById: {};
  user: ContentType[];
}

export const initialState: State = {
  contentList: [],
  contentByNid: [],
  links: {},
  restorableContentAddByBundle: {},
  restorableContentEditById: {},
  user: [],
};

export default (state:State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.CONTENT_SINGLE_LOADED:
      return {
        ...state,
        contentByNid: {
          [action.payload.content.attributes.nid]: action.payload.content,
        },
      };
    case ACTION_TYPE.CONTENT_ADD_CHANGE:
      return {
        ...state,
        restorableContentAddByBundle: {
          ...state.restorableContentAddByBundle,
          [action.payload.bundle]: action.payload.entity,
        },
      };
    case ACTION_TYPE.CONTENT_EDIT_CHANGE:
      return {
        ...state,
        restorableContentEditById: {
          ...state.restorableContentEditById,
          [action.payload.entity.data.id]: action.payload.entity,
        },
      };
    case ACTION_TYPE.CONTENT_ADD:
      return {
        ...state,
        restorableContentAddByBundle: {
          [action.payload.bundle]: null,
        },
      };
    case ACTION_TYPE.CONTENT_LOADED: {
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

    case ACTION_TYPE.CONTENT_DELETE: {
      return {
        ...state,
        contentList: state.contentList.filter(
          content => content.id !== action.payload.content.id,
        ),
      };
    }

    case ACTION_TYPE.USER_LOADED: {
      return {
        ...state,
        user: action.payload.user,
      };
    }

    default:
      return state;
  }
};
