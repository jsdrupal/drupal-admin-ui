import { api as apiHelper } from '@drupal/admin-ui-utilities';

const api = apiHelper.bind(null, process.env.REACT_APP_DRUPAL_BASE_URL);

export default api;
