import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import deepMerge from 'deepmerge';
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
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset,
} from '@material-ui/core/styles';

import routes from './routes';

import Content from './components/05_pages/Content/Content';
import Default from './components/06_wrappers/Default/Default';
import NoMatch from './NoMatch';

import actions from './actions/index';
import reducers, { initialState } from './reducers/index';
import ErrorBoundary from './components/06_wrappers/ErrorBoundary/ErrorBoundary';
import InitialRedirect from './InitialRedirect';

import EnsureComponent from './components/02_atoms/EnsureComponent/EnsureComponent';

const history = createBrowserHistory();
const middleware = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

export const localStorageName = 'drupalAdminUiReduxState';

/**
 * Restore from local storage.
 */
const restoreState = () => {
  let storedState;
  let stringifiedState;
  if (typeof window === 'object') {
    try {
      // Test for Safari private browsing mode. This will throw an error if it can't set an item.
      localStorage.setItem('localStorageTest', true);
      stringifiedState = localStorage.getItem(localStorageName) || '';
    } catch (e) {
      // In case like Safari private browing mode we don't support any restoring.
      // Also note: enzyme has window but no Cookie set.
      stringifiedState =
        (window.Cookie &&
          decodeURIComponent(window.Cookie.get(localStorageName))) ||
        '';
    }
  }

  try {
    storedState = JSON.parse(stringifiedState);
  } catch (e) {
    storedState = {};
  }
  return storedState;
};

export const localStorageStore = state => ({
  content: {
    restorableContentAddByBundle: state.content.restorableContentAddByBundle,
    restorableContentEditById: state.content.restorableContentEditById,
  },
});

const storeState = store => {
  // Persist state.
  const state = store.getState();

  // Save to local storage
  const stringifiedState = JSON.stringify(localStorageStore(state));
  try {
    localStorage.setItem(localStorageName, stringifiedState);
  } catch (e) {
    // This will happen with Safari in private browsing mode.
  }
};

const store = createStore(
  combineReducers({ ...reducers, router: routerReducer }),
  deepMerge(initialState, restoreState()),
  composeWithDevTools(applyMiddleware(sagaMiddleware, middleware)),
);
sagaMiddleware.run(actions);

if (typeof window === 'object') {
  store.subscribe(() => storeState(store));
}

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const App = ({ serverRoutes }) => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <ErrorBoundary>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Default>
              <Switch>
                <Route exact path="/" component={withRouter(Content)} />
                {Object.entries({
                  ...routes,
                  ...Object.values(serverRoutes).reduce(
                    (acc, { route, component, moduleName: routePrefix }) => ({
                      ...acc,
                      ...{ [`/${routePrefix}${route}`]: component },
                    }),
                    {},
                  ),
                }).map(([route, component]) => (
                  <Route
                    exact
                    path={route}
                    component={() => (
                      <EnsureComponent
                        component={component}
                        render={widgetComponent =>
                          React.createElement(withRouter(widgetComponent))
                        }
                      />
                    )}
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
    </MuiThemeProvider>
  </JssProvider>
);

App.propTypes = {
  serverRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
    }),
  ),
};

App.defaultProps = {
  serverRoutes: [],
};

export default App;
