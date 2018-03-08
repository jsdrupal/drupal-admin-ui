import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './components/05_pages/Home/Home';
import Permissions from './components/05_pages/Permissions/Permissions';

import normalize from './styles/normalize'; // eslint-disable-line no-unused-vars
import base from './styles/base'; // eslint-disable-line no-unused-vars

class NoMatch extends Component {
  componentWillReceiveProps(nextProps) {
    if (!Object.keys(routes).includes(nextProps.location.pathname)) {
      window.location = window.location.href;
    }
  }
  render() {
    return null;
  }
}

// @todo Share this with Drupal
const routes = {
  '/admin/people/permissions': Permissions,
};

class App extends Component {
  componentDidMount() {
    window.history.replaceState(null, null, '/');
  }
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin/people/permissions">Permissions</Link>
            </li>
            <li>
              <Link to="/admin/appearance">Appearance</Link>
            </li>
            <li>
              <Link to="/node/add">Content</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          {Object.keys(routes).map(route => (
            <Route path={route} component={routes[route]} key={route} />
          ))}
          <Route component={NoMatch} />
        </div>
      </Router>
    );
  }
}

export default App;
