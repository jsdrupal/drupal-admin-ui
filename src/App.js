import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import routes from './routes';

import Default from './components/06_wrappers/Default/Default';
import Home from './components/05_pages/Home/Home';
import NoMatch from './NoMatch';

import normalize from './styles/normalize'; // eslint-disable-line no-unused-vars
import base from './styles/base'; // eslint-disable-line no-unused-vars
import actions from './actions/index';
import reducers from './reducers/index';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(actions);

class App extends Component {
  componentDidMount() {
    window.history.replaceState(null, null, '/');
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Default>
            <Switch>
              <Route exact path="/" component={Home} />
              {Object.keys(routes).map(route => (
                <Route path={route} component={routes[route]} key={route} />
              ))}
              <Route component={NoMatch} />
            </Switch>
          </Default>
        </Router>
      </Provider>
    );
  }
}

export default App;
