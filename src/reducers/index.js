import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application from './application';
import content from './content';
import schema from './schema';

const reducers = { application, content, schema };
export default { ...reducers, loadingBar };
