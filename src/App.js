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

import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

import routes from './routes';

import Content from './components/05_pages/Content/Content';
import Default from './components/06_wrappers/Default/Default';
import NoMatch from './NoMatch';

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

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

const App = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <ErrorBoundary>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Default>
            <Switch>
              <Route exact path="/" component={withRouter(Content)} />
              {Object.keys(routes).map(route => (
                <Route
                  exact
                  path={route}
                  component={withRouter(routes[route])}
                  key={route}
                />
              ))}
              <Route
                path="/(vfancy/?)"
                component={withRouter(InitialRedirect)}
              />
              <Route component={NoMatch} />
            </Switch>
          </Default>
        </ConnectedRouter>
      </Provider>
    </ErrorBoundary>
  </JssProvider>
);

export default App;
