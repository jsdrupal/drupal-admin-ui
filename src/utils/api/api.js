import qs from 'qs';
import { ApiError } from './errors';
import * as apiConstants from '../../constants/api';

async function api(
  endpoint,
  { queryString = null, parameters = {}, options = {} } = {},
) {
  let url;
  options.credentials = 'include';
  options.headers = options.headers || {};

  switch (endpoint) {
    case apiConstants.CASE_MENU:
      url = `${apiConstants.URL_MENU}?${apiConstants.FORMAT_JSON}`;
      break;
    case apiConstants.CASE_DBLOG:
      url = `${apiConstants.URL_DBLOG}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_CSRF_TOKEN:
      url = `${apiConstants.URL_CSRF_TOKEN}`;
      options.text = true;
      break;
    case apiConstants.CASE_DBLOG_TYPES:
      url = `${apiConstants.URL_DBLOG_TYPES}?${apiConstants.FORMAT_JSON}`;
      break;
    case apiConstants.CASE_ROLES:
      url = `${apiConstants.URL_ROLES}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_ROLE:
      url = `${apiConstants.URL_ROLES}/${parameters.role.id}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_ROLE_PATCH:
      url = `${apiConstants.URL_ROLES}/${parameters.role.id}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      options.method = 'PATCH';
      options.body = JSON.stringify({ data: parameters.role });
      options.headers['Content-Type'] = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_FILE_UPLOAD:
      url = `${apiConstants.URL_FILE_UPLOAD}/${parameters.entityTypeId}/${
        parameters.bundle
      }/${parameters.fieldName}`;
      options.method = 'POST';
      options.headers['Content-Type'] = `${apiConstants.APP_OCTET_STREAM}`;
      options.headers['Content-Disposition'] = `file; filename="${
        parameters.fileName
      }"`;
      options.body = parameters.body;
      break;
    case apiConstants.CASE_PERMISSIONS:
      url = `${apiConstants.URL_PERMISSIONS}?${apiConstants.FORMAT_JSON}`;
      break;
    case apiConstants.CASE_CONTENT:
      url = `${apiConstants.URL_CONTENT}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_CONTENT_SINGLE:
      url = `${apiConstants.URL_CONTENT}/${parameters.bundle}/${parameters.id}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_FILE:
      url = `${apiConstants.URL_FILE}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_ACTIONS:
      url = `${apiConstants.URL_ACTIONS}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_CONTENT_TYPES:
      url = `${apiConstants.URL_CONTENT_TYPES}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    case apiConstants.CASE_NODE_DELETE: {
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
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      options.headers['X-CSRF-Token'] = deleteToken;
      options.headers['Content-Type'] = `${apiConstants.API_HEADERS_JSON}`;
      options.method = 'DELETE';
      url = parameters.node.links.self.replace(
        process.env.REACT_APP_DRUPAL_BASE_URL,
        '',
      );
      break;
    }
    case apiConstants.CASE_NODE_ADD: {
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
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      options.headers['X-CSRF-Token'] = saveToken;
      options.method = 'POST';
      options.body = JSON.stringify({ data: node });
      url = `/jsonapi/${node.type.replace('--', '/')}`;
      break;
    }
    case apiConstants.CASE_NODE_SAVE: {
      // Set the type to the right value for jsonapi to process.
      // @todo Ideally this should not be differnet in the first place.
      parameters.node = {
        ...parameters.node,
        type: parameters.node.type.includes('--')
          ? parameters.node.type
          : `node--${parameters.node.type}`,
      };

      const saveToken = await api('csrf_token');
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      options.headers['X-CSRF-Token'] = saveToken;
      options.method = 'PATCH';
      options.body = JSON.stringify({ data: parameters.node });
      url = parameters.node.links.self.replace(
        process.env.REACT_APP_DRUPAL_BASE_URL,
        '',
      );
      break;
    }
    case apiConstants.CASE_TAXONOMY_TERM: {
      url = `${apiConstants.URL_TAXONOMY_TERM}/${parameters.type}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    }
    case apiConstants.CASE_USER: {
      url = `${apiConstants.URL_USER}`;
      options.headers.Accept = `${apiConstants.API_HEADERS_JSON}`;
      break;
    }
    case apiConstants.CASE_SCHEMA: {
      url = `${apiConstants.URL_SCHEMA}/${[
        parameters.entityTypeId,
        parameters.bundle,
      ].join('/')}`;
      break;
    }
    case apiConstants.CASE_FIELD_SCHEMA: {
      url = `${apiConstants.URL_FIELD_SCHEMA}`;
      break;
    }
    case apiConstants.CASE_FORM_DISPLAY: {
      url = `${apiConstants.URL_FORM_DISPLAY}`;
      break;
    }
    case apiConstants.CASE_FIELD_STORAGE_CONFIG: {
      url = `${apiConstants.URL_FIELD_STORAGE_CONFIG}`;
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
