import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application, {
  initialState as applicationInitialState,
} from './application';
import content, { initialState as contentInitialState } from './content';
import schema, { initialState as schemaInitialState } from './schema';

const reducers = { application, content, schema };
export const initialState = {
  application: applicationInitialState,
  content: contentInitialState,
  schema: schemaInitialState,
};
export default { ...reducers, loadingBar };
