const replaceArray = (replaces, string) => {
  let replacedString = string;
  Object.entries(replaces).forEach(([find, replace]) => {
    replacedString = replacedString.replace(find, replace);
  });
  return replacedString;
};

async function api(endpoint, init = {}, parameters = {}) {
  let url;
  init.credentials = 'include';
  init.headers = init.headers ? init.headers : {};
  switch (endpoint) {
    case 'menu':
      url = '/admin-api/menu?_format=json';
      break;
    case 'roles':
      url = '/jsonapi/user_role/user_role';
      init.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role':
      url = `/jsonapi/user_role/user_role/${parameters.role.id}`;
      init.headers.Accept = 'application/vnd.api+json';
      break;
    case 'role:post':
      url = `/jsonapi/user_role/user_role/${parameters.role.id}`;
      init.headers.Accept = 'application/vnd.api+json';
      init.body = JSON.stringify({ data: parameters.role });
      init.headers['Content-Type'] = 'application/vnd.api+json';
      break;
    case 'permissions':
      url = '/admin-api/permissions?_format=json';
      break;
    default:
      break;
  }

  const data = await fetch(
    process.env.REACT_APP_DRUPAL_BASE_URL + url,
    init,
  ).then(res => res.json());
  return data;
}

export default api;
