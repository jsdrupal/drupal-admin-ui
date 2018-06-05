import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import { reducer as burgerMenu } from 'redux-burger-menu';
import application from './application';
import content from './content';

const reducers = { burgerMenu, application, content };
export default { ...reducers, loadingBar };
