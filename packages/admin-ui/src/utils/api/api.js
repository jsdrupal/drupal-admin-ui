import { api } from '@drupal/admin-ui-utilities';

export default (...args) => api(process.env.REACT_APP_DRUPAL_BASE_URL, ...args);
