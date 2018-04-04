async function api(endpoint, options = {}) {
  let url;
  const { queryString, ...fetchOptions } = options;

  fetchOptions.credentials = 'include';
  switch (endpoint) {
    case 'menu':
      url = '/admin-api/menu?_format=json';
      break;
    case 'dblog':
      url = '/jsonapi/watchdog_entity/watchdog_entity';
      break;
    case 'roles':
      url = '/jsonapi/user_role/user_role';
      break;
    default:
      break;
  }

  const data = await fetch(
    `${process.env.REACT_APP_DRUPAL_BASE_URL}${url}${
      queryString ? `?${queryString}` : ''
    }`,
    fetchOptions,
  ).then(res => res.json());
  return data;
}

export default api;
