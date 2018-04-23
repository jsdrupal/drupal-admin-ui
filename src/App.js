import React from 'react';
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
import InitialRedirect from './InitialRedirect';

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

const App = () => (
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
          <Route path="/(vfancy/?)" component={withRouter(InitialRedirect)} />
          <Route component={NoMatch} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </ErrorBoundary>
);

export default App;
