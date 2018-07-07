import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application from './application';
import content from './content';

const reducers = { application, content };
export default { ...reducers, loadingBar };
