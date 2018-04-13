import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import { reducer as burgerMenu } from 'redux-burger-menu';
import application from './application';

const reducers = { application, burgerMenu };
export default { ...reducers, loadingBar };
