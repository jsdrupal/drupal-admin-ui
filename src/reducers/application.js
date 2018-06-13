import { LOCATION_CHANGE } from 'react-router-redux';
import { ROLES_LOADED } from '../actions/roles';
import {
  DBLOG_COLLECTION_LOADED,
  DBLOG_FILTER_UPDATED,
} from '../actions/reports';
import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  MENU_LOADED,
  CONTENT_TYPES_LOADED,
} from '../actions/application';

export const initialState = {
  message: null,
  menuLinks: [],
  filterString: '',
  contentTypes: {},
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE: {
      return {
        ...state,
        message: {
          message: action.payload.message,
          type: action.payload.type,
        },
      };
    }
    case CLEAR_MESSAGE: {
      return {
        ...state,
        message: null,
      };
    }
    case LOCATION_CHANGE: {
      // Clear messages on every location change.
      return {
        ...state,
        message: null,
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
    default: {
      return { ...state };
    }
  }
};
