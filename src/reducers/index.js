import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application from './application';

const reducers = { application };
export default { ...reducers, loadingBar };
