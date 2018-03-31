import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';
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
import ErrorBoundary from './components/06_wrappers/ErrorBoundary/ErrorBoundary';

const history = createBrowserHistory();
const middleware = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ ...reducers, router: routerReducer }),
  composeWithDevTools(applyMiddleware(sagaMiddleware, middleware)),
);
sagaMiddleware.run(actions);

const withDefault = component => () => (
  <Default>{React.createElement(component)}</Default>
);

class App extends Component {
  componentDidMount() {
    // Allow Drupal redirects to determine the initial path.
    const search = history.location.search
      .replace('?q=', '')
      // trim slashes on the left.
      .replace(/^\//, '');
    history.replace(`/${search}`);
  }
  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" component={withDefault(withRouter(Home))} />
              {Object.keys(routes).map(route => (
                <Route
                  path={route}
                  component={withDefault(withRouter(routes[route]))}
                  key={route}
                />
              ))}
              <Route component={NoMatch} />
            </Switch>
          </ConnectedRouter>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default App;
