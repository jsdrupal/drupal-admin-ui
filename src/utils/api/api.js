async function api(endpoint, init = {}) {
  let url;
  const { parameters, ...options } = init;
  options.headers = options.headers || {};
  options.credentials = 'include';

  switch (endpoint) {
    case 'menu':
      url = '/admin-api/menu?_format=json';
      break;
    case 'roles':
      url = '/jsonapi/user_role/user_role';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role':
      url = `/jsonapi/user_role/user_role/${parameters.role.id}`;
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role:patch':
      url = `/jsonapi/user_role/user_role/${parameters.role.id}`;
      options.headers.Accept = 'application/vnd.api+json';
      options.method = 'PATCH';
      options.body = JSON.stringify({ data: parameters.role });
      options.headers['Content-Type'] = 'application/vnd.api+json';
      break;
    case 'permissions':
      url = '/admin-api/permissions?_format=json';
      break;
    case 'content':
      url = '/jsonapi/node/article';
      break;
    default:
      break;
  }

  const data = await fetch(
    process.env.REACT_APP_DRUPAL_BASE_URL + url,
    options,
  ).then(res => res.json());
  return data;
}

export default api;
