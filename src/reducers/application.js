import { LOCATION_CHANGE } from 'react-router-redux';
import { ROLES_LOADED } from '../actions/roles';
import {
  SET_MESSAGE,
  CLEAR_MESSAGE,
  MENU_LOADED,
} from '../actions/application';

const initialState = {
  message: null,
  menuLinks: [],
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
        // Explicitly add the Permissions in as a top level item, as it's usually just a local tab.
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
        }
        return menuLink;
      });
      return {
        ...state,
        menuLinks,
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
