import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const axe = require('react-axe');
  axe(React, ReactDOM);
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
