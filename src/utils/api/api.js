import qs from 'qs';

async function api(
  endpoint,
  { queryString = null, parameters = {}, options = {} } = {},
) {
  let url;
  options.credentials = 'include';
  options.headers = options.headers || {};

  switch (endpoint) {
    case 'menu':
      url = '/admin-api/menu?_format=json';
      break;
    case 'dblog':
      url = '/jsonapi/watchdog_entity/watchdog_entity';
      break;
    case 'csrf_token':
      url = '/session/token';
      options.text = true;
      break;
    case 'dblog:types':
      url = '/admin-ui-support/dblog-types?_format=json';
      break;
    case 'roles':
      url = '/jsonapi/user_role';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role':
      url = `/jsonapi/user_role/${parameters.role.id}`;
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role:patch':
      url = `/jsonapi/user_role/${parameters.role.id}`;
      options.headers.Accept = 'application/vnd.api+json';
      options.method = 'PATCH';
      options.body = JSON.stringify({ data: parameters.role });
      options.headers['Content-Type'] = 'application/vnd.api+json';
      break;
    case 'permissions':
      url = '/admin-api/permissions?_format=json';
      break;
    case 'content':
      url = '/jsonapi/node';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'actions':
      url = '/jsonapi/action';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'contentTypes':
      url = '/jsonapi/node_type';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'node:delete': {
      // Set the type to the right value for jsonapi to process.
      // @todo Ideally this should not be differnet in the first place.
      parameters.node = {
        ...parameters.node,
        type: parameters.node.type.includes('--')
          ? parameters.node.type
          : `node--${parameters.node.type}`,
      };

      const deleteToken = await api('csrf_token');
      // @todo Delete requests sadly return non json.
      options.text = true;
      options.headers.Accept = 'application/vnd.api+json';
      options.headers['X-CSRF-Token'] = deleteToken;
      options.headers['Content-Type'] = 'application/vnd.api+json';
      options.method = 'DELETE';
      url = parameters.node.links.self.replace(
        process.env.REACT_APP_DRUPAL_BASE_URL,
        '',
      );
      break;
    }
    case 'node:save': {
      // Set the type to the right value for jsonapi to process.
      // @todo Ideally this should not be differnet in the first place.
      parameters.node = {
        ...parameters.node,
        type: parameters.node.type.includes('--')
          ? parameters.node.type
          : `node--${parameters.node.type}`,
      };

      const saveToken = await api('csrf_token');
      options.headers.Accept = 'application/vnd.api+json';
      options.headers['X-CSRF-Token'] = saveToken;
      options.method = 'PATCH';
      options.body = JSON.stringify({ data: parameters.node });
      url = parameters.node.links.self.replace(
        process.env.REACT_APP_DRUPAL_BASE_URL,
        '',
      );
      break;
    }
    default:
      break;
  }

  const data = await fetch(
    `${process.env.REACT_APP_DRUPAL_BASE_URL}${url}${
      queryString
        ? `?${qs.stringify(queryString, { arrayFormat: 'brackets' })}`
        : ''
    }`,
    options,
  ).then(res => {
    // CSRF tokens return text, not json.
    if (options.text) {
      return res.text();
    }
    return res.json();
  });
  return data;
}

export default api;
