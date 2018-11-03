import { Action } from '../actions/action';
import { ACTION_TYPE } from '../constants/action_type';
import { ContentType } from '../constants/content_type';
import { MenuLink } from '../constants/menu_link';
import { MESSAGE_SEVERITY } from '../constants/message_severity';

interface Message {
  message: string;
  messageSeverity: MESSAGE_SEVERITY;
  key: string;
  open: boolean;
}

interface State {
  actions: Action[];
  contentTypes: ContentType[];
  dblog?: [];
  drawerOpen: boolean;
  messages: Message[];
  menuLinks: MenuLink | MenuLink[];
  filterString: string;
}

export const initialState = {
  actions: [],
  contentTypes: [],
  dblog: [],
  drawerOpen: false,
  messages: [],
  menuLinks: [],
  filterString: '',
};

// @ts-ignore
export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.CLOSE_DRAWER: {
      return {
        ...state,
        drawerOpen: false,
      };
    }
    case ACTION_TYPE.OPEN_DRAWER: {
      return {
        ...state,
        drawerOpen: true,
      };
    }
    case ACTION_TYPE.SET_MESSAGE: {
      // This causes a new messages object to be created, instead of
      // maintaining a reference to the old data structure.
      const messages = [...state.messages];
      messages.push({
        // @ts-ignore
        message: action.payload.message,
        // @ts-ignore
        messageSeverity: action.payload.messageSeverity,
        key: String(Date.now() + Math.random()),
        open: true,
      });
      return {
        ...state,
        messages,
      };
    }
    case ACTION_TYPE.CLEAR_MESSAGE: {
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
    case ACTION_TYPE.CLEAR_ALL_MESSAGES: {
      const messages: Message[] = [];
      return {
        ...state,
        messages,
      };
    }
    case ACTION_TYPE.LOCATION_CHANGE: {
      // Clear messages on every location change.
      return {
        ...state,
        messages: [],
      };
    }
    case ACTION_TYPE.MENU_LOADED: {
      return {
        ...state,
        menuLinks: Array.isArray(action.payload.menuLinks)
          ? action.payload.menuLinks
          : [],
      };
    }
    case ACTION_TYPE.DBLOG_COLLECTION_LOADED: {
      const { dblog, ...rest } = state;
      return {
        ...rest,
        dblog: {
          ...dblog,
          next:
            Object.prototype.hasOwnProperty.call(
              // ts-ignore
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
    case ACTION_TYPE.DBLOG_FILTER_UPDATED: {
      const { dblog, ...rest } = state;
      return {
        ...rest,
        dblog: {
          ...dblog,
          filterOptions: action.payload.options,
        },
      };
    }
    case ACTION_TYPE.ROLES_LOADED: {
      const roles = action.payload.roles.data;
      return {
        ...state,
        roles,
      };
    }
    case ACTION_TYPE.CONTENT_TYPES_LOADED: {
      return {
        ...state,
        contentTypes: action.payload.contentTypes.data.reduce(
          (accumulator, contentType) => ({
            ...accumulator,
            // @ts-ignore
            [contentType.attributes.type]: ContentType,
          }),
          {},
        ),
      };
    }
    case ACTION_TYPE.ACTIONS_LOADED: {
      return {
        ...state,
        actions: action.payload.actions.data,
      };
    }
    default:
      return state;
  }
};
