import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Disable react-axe without an additional cli flag.
// See README.md for more information.
if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_AXE) {
  // tslint:disable-next-line: import/no-extraneous-dependencies, global-require
  // @ts-ignore
  // const axe = require('react-axe');
  // axe(React, ReactDOM);
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
