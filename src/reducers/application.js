import { SET_ERROR, MENU_LOADED } from '../actions/application';

const initialState = {
  error: null,
  menuLinks: {},
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
      const menuLinks = Object.entries(action.payload.menuLinks).reduce(
        (acc, [key, menuLink]) => {
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
          acc[key] = menuLink;
          return acc;
        },
        {},
      );
      return {
        ...state,
        menuLinks,
      };
    }
    default: {
      return { ...state };
    }
  }
};
