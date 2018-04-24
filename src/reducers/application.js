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
} from '../actions/application';

export const initialState = {
  message: null,
  menuLinks: [],
  filterString: '',
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
      const menuLinks = action.payload.menuLinks.map(menuLink => {
        // Explicitly add the Permissions and Roles as top level menu items, as
        // those are usually local tasks which are not supported at the moment.
        if (menuLink.link.url.indexOf('admin/people') !== -1) {
          menuLink.subtree.push({
            subtree: [],
            hasChildren: false,
            inActiveTrail: false,
            link: {
              weight: '4',
              title: '🔐 Permissions',
              description: 'Manage permissions.',
              menuName: 'admin',
              url: '/admin/people/permissions',
            },
          });
          menuLink.subtree.push({
            subtree: [],
            hasChildren: false,
            inActiveTrail: false,
            link: {
              weight: '5',
              title: '📇 Roles',
              description: 'Manage roles.',
              menuName: 'admin',
              url: '/admin/people/roles',
            },
          });
        }
        return menuLink;
      });
      return {
        ...state,
        menuLinks,
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
    default: {
      return { ...state };
    }
  }
};
