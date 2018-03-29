import { SET_ERROR, MENU_LOADED } from '../actions/application';
import { DBLOG_COLLECTION_LOADED } from '../actions/reports';

const initialState = {
  error: null,
  menuLinks: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR: {
      return {
        ...state,
        error: action.payload.error,
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
    case DBLOG_COLLECTION_LOADED: {
      return {
        ...state,
        dbLogEntries: action.payload,
      }
    }
    default: {
      return { ...state };
    }
  }
};
