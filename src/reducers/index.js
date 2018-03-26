import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application from './application';

const reducers = { application };
export default combineReducers({ ...reducers, loadingBar });
