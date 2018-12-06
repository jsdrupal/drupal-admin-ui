import React from 'react';
import ReactDOM from 'react-dom';
import { api } from '@drupal/admin-ui-utilities';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const { REACT_APP_DRUPAL_BASE_URL, NODE_ENV, REACT_APP_AXE } = process.env;

// Disable react-axe without an additional cli flag.
// See README.md for more information.
if (NODE_ENV !== 'production' && REACT_APP_AXE) {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const axe = require('react-axe');
  axe(React, ReactDOM);
}

// Fetch routes provided by Drupal modules.
// This happens outsite of React and before the application starts.
api(REACT_APP_DRUPAL_BASE_URL, 'admin_ui_routes').then(({ routes }) => {
  ReactDOM.render(
    <App serverRoutes={routes} />,
    document.getElementById('root'),
  );
});
registerServiceWorker();
