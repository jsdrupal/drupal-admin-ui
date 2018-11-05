import { LOCATION_CHANGE } from 'react-router-redux';
import { ROLES_LOADED } from '../actions/roles';
import {
  DBLOG_COLLECTION_LOADED,
  DBLOG_FILTER_UPDATED,
} from '../actions/reports';
import {
  CLOSE_DRAWER,
  OPEN_DRAWER,
  SET_MESSAGE,
  CLEAR_MESSAGE,
  CLEAR_ALL_MESSAGES,
  MENU_LOADED,
  CONTENT_TYPES_LOADED,
  ACTIONS_LOADED,
  COMPONENT_LIST_LOADED,
} from '../actions/application';

export const initialState = {
  messages: [],
  menuLinks: [],
  filterString: '',
  contentTypes: {},
  actions: [],
  drawerOpen: false,
  components: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_DRAWER: {
      return {
        ...state,
        drawerOpen: false,
      };
    }
    case OPEN_DRAWER: {
      return {
        ...state,
        drawerOpen: true,
      };
    }
    case SET_MESSAGE: {
      // This causes a new messages object to be created, instead of
      // maintaining a reference to the old data structure.
      const messages = [...state.messages];
      messages.push({
        message: action.payload.message,
        messageSeverity: action.payload.messageSeverity,
        key: Date.now() + Math.random(),
        open: true,
      });
      return {
        ...state,
        messages,
      };
    }
    case CLEAR_MESSAGE: {
      const messages = [...state.messages];
      messages.splice(
        messages.findIndex(message => message.key === action.payload.key),
        1,
      );
      return {
        ...state,
        messages,
      };
    }
    case CLEAR_ALL_MESSAGES: {
      const messages = [];
      return {
        ...state,
        messages,
      };
    }
    case LOCATION_CHANGE: {
      // Clear messages on every location change.
      return {
        ...state,
        messages: [],
      };
    }
    case MENU_LOADED: {
      return {
        ...state,
        menuLinks: Array.isArray(action.payload.menuLinks)
          ? action.payload.menuLinks
          : [],
      };
    }
    case DBLOG_COLLECTION_LOADED: {
      const { dblog, ...rest } = state;
      return {
        ...rest,
        dblog: {
          ...dblog,
          next:
            Object.prototype.hasOwnProperty.call(
              action.payload.dbLogEntries.links,
              'next',
            ) || false,
          entries: action.payload.dbLogEntries.data.map(
            ({
              attributes: {
                wid,
                message_formatted_plain: messageFormattedPlain,
                timestamp,
                type,
              },
            }) => ({ wid, messageFormattedPlain, timestamp, type }),
          ),
          availableTypes: action.payload.dbLogEntriesTypes,
        },
      };
    }
    case DBLOG_FILTER_UPDATED: {
      const { dblog, ...rest } = state;
      return {
        ...rest,
        dblog: {
          ...dblog,
          filterOptions: action.payload.options,
        },
      };
    }
    case ROLES_LOADED: {
      const roles = action.payload.roles.data;
      return {
        ...state,
        roles,
      };
    }
    case CONTENT_TYPES_LOADED: {
      return {
        ...state,
        contentTypes: action.payload.contentTypes.data.reduce(
          (accumulator, contentType) => ({
            ...accumulator,
            [contentType.attributes.type]: {
              name: contentType.attributes.name,
              description: contentType.attributes.description,
            },
          }),
          {},
        ),
      };
    }
    case ACTIONS_LOADED: {
      return {
        ...state,
        actions: action.payload.actions.data,
      };
    }
    case COMPONENT_LIST_LOADED: {
      return {
        ...state,
        components: action.payload.components,
      };
    }
    default:
      return state;
  }
};
