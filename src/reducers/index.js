import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import application, {
  initialState as applicationInitialState,
} from './application';
import content, { initialState as contentInitialState } from './content';
import schema, { initialState as schemaInitialState } from './schema';
import taxonomy, { initialState as taxonomyInitialState } from './taxonomy';

const reducers = { application, content, schema, taxonomy };
export const initialState = {
  application: applicationInitialState,
  content: contentInitialState,
  schema: schemaInitialState,
  taxonomy: taxonomyInitialState,
};
export default { ...reducers, loadingBar };
