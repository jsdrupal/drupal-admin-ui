import qs from 'qs';
import { ApiError } from './errors';

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
      url = '/jsonapi/watchdog_entity/';
      options.headers.Accept = 'application/vnd.api+json';
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
    case 'file:upload':
      url = `/file/upload/${parameters.entityTypeId}/${parameters.bundle}/${
        parameters.fieldName
      }`;
      options.method = 'POST';
      options.headers['Content-Type'] = 'application/octet-stream';
      options.headers['Content-Disposition'] = `file; filename="${
        parameters.fileName
      }"`;
      options.body = parameters.body;
      break;
    case 'permissions':
      url = '/admin-api/permissions?_format=json';
      break;
    case 'content':
      url = '/jsonapi/node';
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'content_single':
      url = `/jsonapi/node/${parameters.bundle}/${parameters.id}`;
      options.headers.Accept = 'application/vnd.api+json';
      break;
    case 'file':
      url = `/jsonapi/file`;
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
    case 'node:add': {
      const { node } = parameters;
      // Set the type to the right value for jsonapi to process.
      // @todo Ideally this should not be differnet in the first place.
      node.type = node.type.includes('--') ? node.type : `node--${node.type}`;

      // Ensure that we don't have an ID when creating new content.
      delete node.id;
      delete node.attributes.nid;
      delete node.attributes.revision_timestamp;
      delete node.attributes.changed;

      // Delete revision_uid, type, uid
      delete node.relationships.revision_uid;
      delete node.relationships.type;
      delete node.relationships.uid;

      const saveToken = await api('csrf_token');
      options.headers.Accept = 'application/vnd.api+json';
      options.headers['X-CSRF-Token'] = saveToken;
      options.method = 'POST';
      options.body = JSON.stringify({ data: node });
      url = `/jsonapi/${node.type.replace('--', '/')}`;
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
    case 'taxonomy_term': {
      url = `/jsonapi/taxonomy_term/${parameters.type}`;
      options.headers.Accept = 'application/vnd.api+json';
      break;
    }
    case 'user': {
      url = `/jsonapi/user`;
      options.headers.Accept = 'application/vnd.api+json';
      break;
    }
    case 'schema': {
      url = `/schemata/${[parameters.entityTypeId, parameters.bundle].join(
        '/',
      )}`;
      break;
    }
    case 'field_schema': {
      url = '/jsonapi/field_config';
      break;
    }
    case 'form_display': {
      url = '/jsonapi/entity_form_display';
      break;
    }
    case 'field_storage_config': {
      url = '/jsonapi/field_storage_config';
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
    if (![200, 201, 204].includes(res.status)) {
      throw new ApiError(res.status, res.statusText, res.body);
    }

    // CSRF tokens return text, not json.
    if (options.text) {
      return res.text();
    }
    return res.json();
  });
  return data;
}

export default api;
