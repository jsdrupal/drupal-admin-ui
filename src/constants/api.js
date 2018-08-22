// API Switch Cases
export const CASE_MENU = 'menu';
export const CASE_DBLOG = 'dblog';
export const CASE_CSRF_TOKEN = 'csrf_token';
export const CASE_DBLOG_TYPES = 'dblog:types';

export const CASE_ROLES = 'roles';
export const CASE_ROLE = 'role';
export const CASE_ROLE_PATCH = 'role:patch';

export const CASE_FILE_UPLOAD = 'file:upload';
export const CASE_PERMISSIONS = 'permissions';

export const CASE_CONTENT = 'content';
export const CASE_CONTENT_SINGLE = 'content_single';

export const CASE_FILE = 'file';
export const CASE_ACTIONS = 'actions';
export const CASE_CONTENT_TYPES = 'contentTypes';

export const CASE_NODE_DELETE = 'node:delete';
export const CASE_NODE_ADD = 'node:add';
export const CASE_NODE_SAVE = 'node:save';

export const CASE_TAXONOMY_TERM = 'taxonomy_term';
export const CASE_USER = 'user';

export const CASE_SCHEMA = 'schema';
export const CASE_FIELD_SCHEMA = 'field_schema';
export const CASE_FORM_DISPLAY = 'form_display';
export const CASE_FIELD_STORAGE_CONFIG = 'field_storage_config';

// Formats
export const FORMAT_JSON = '_format=json';

// Headers
export const API_HEADERS_JSON = 'application/vnd.api+json';

// Content-Types
export const APP_OCTET_STREAM = 'application/octet-stream';

// API Urls
export const URL_MENU = `/admin-api/menu`;
export const URL_DBLOG = '/jsonapi/watchdog_entity';
export const URL_CSRF_TOKEN = '/session/token';
export const URL_DBLOG_TYPES = `/admin-ui-support/dblog-types`;

export const URL_ROLES = '/jsonapi/user_role';

export const URL_FILE_UPLOAD = '/file/upload';
export const URL_PERMISSIONS = `/admin-api/permissions`;

export const URL_CONTENT = '/jsonapi/node';

export const URL_FILE = '/jsonapi/file';
export const URL_ACTIONS = '/jsonapi/action';
export const URL_CONTENT_TYPES = '/jsonapi/node_type';

export const URL_NODE_ADD = '/jsonapi/';

export const URL_TAXONOMY_TERM = '/jsonapi/taxonomy_term';
export const URL_USER = '/jsonapi/user';

export const URL_SCHEMA = '/schemata';
export const URL_FIELD_SCHEMA = '/jsonapi/field_config';
export const URL_FORM_DISPLAY = '/jsonapi/entity_form_display';
export const URL_FIELD_STORAGE_CONFIG = '/jsonapi/field_storage_config';
