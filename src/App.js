import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


const Home = () => (
  <div>
    <h1>Hello, world!</h1>
  </div>
);

const Permissions = () => (
  <div>
    <h1>Permissions</h1>
    <p>This will be the permissions page.</p>
  </div>
);

const routes = {
  '/': Home,
  '/admin/people/permissions': Permissions,
};

class NoMatch extends Component {
  componentWillReceiveProps(nextProps) {
    if (!Object.keys(routes).includes(nextProps.location.pathname)) {
      window.location = window.location.href;
    }
  }
  render() {
    return null;
  }
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/admin/people/permissions">Permissions</Link></li>
            <li><Link to="/admin/appearance">Appearance</Link></li>
            <li><Link to="/node/add">Content</Link></li>
          </ul>

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/admin/people/permissions" component={Permissions}/>
          <Route component={NoMatch} />
        </div>
      </Router>
    );
  }
};

export default App;
