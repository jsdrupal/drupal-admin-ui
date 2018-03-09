import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import routes from './routes';

import Home from './components/05_pages/Home/Home';
import NoMatch from './NoMatch';

import normalize from './styles/normalize'; // eslint-disable-line no-unused-vars
import base from './styles/base'; // eslint-disable-line no-unused-vars

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
