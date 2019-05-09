# @drupal/admin-ui-utilities

Helper utilities for Admin UI and extension point projects.

## `api`

An `async` helper function for making requests to a Drupal backend.

- `@param {string} REACT_APP_DRUPAL_BASE_URL` The base url of the backend (Drupal)
- `@param {string} endpoint` The name of the end point you want to use.
- `@param {Object} [settings={}]` Optional settings.
  - `@param {Object} [settings.queryString=null]` Key value parameters to be processed into a query string.
  - `@param {Object} [settings.parameters={}]` Route string construction parameters.
  - `@param {Object} [settings.options={}]` HTTP request options.
- `@return {Promise} ` Result of the `fetch` operation.

### Examples

```javascript
import { api } from '@drupal/admin-ui-utilities';

api(REACT_APP_DRUPAL_BASE_URL, 'admin_ui_routes')
  .then(({ routes }) => {
    //...
  });
```
