const replaceArray = (replaces, string) => {
  let replacedString = string;
  Object.entries(replaces).forEach(([find, replace]) => {
    replacedString = replacedString.replace(find, replace);
  });
  return replacedString;
};

async function api(endpoint, parameters = {}, init = {}) {
  let url;
  init.credentials = 'include';
  switch (endpoint) {
    case 'menu':
      url = '/admin-api/menu?_format=json';
      break;
    case 'roles':
      url = '/jsonapi/user_role/user_role';
      break;
    case 'simple_config':
      url = '/config/$name?_format=json';
      break;
    default:
      throw new Error('Undefined endpoint');
  }

  url = replaceArray(parameters, url);
  const data = await fetch(
    process.env.REACT_APP_DRUPAL_BASE_URL + url,
    init,
  ).then(res => res.json());
  return data;
}

export default api;
