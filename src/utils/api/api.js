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
    case 'rest.csrf':
      url = '/rest/session/token';
      options.plain = true;
      break;
    case 'file:upload':
      url = `/file/upload/${parameters.entity_type_id}/${parameters.bundle}/${
        parameters.field_name
      }`;
      options.method = 'POST';
      options.headers['Content-Type'] = 'application/octet-stream';
      options.headers['Content-Disposition'] = `file; filename="${
        parameters.file_name
      }"`;
      options.body = parameters.body;
      break;
    case 'permissions':
      url = '/admin-api/permissions?_format=json';
      break;
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
  ).then(res => (options.plain ? res.text() : res.json()));
  return data;
}

export default api;
