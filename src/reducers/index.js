import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application from './application';
import content from './content';
import schema from './schema';
import snackbar from './snackbar';

const reducers = { application, content, schema, snackbar };
export default { ...reducers, loadingBar };
