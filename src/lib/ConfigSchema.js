import immutable from 'immutable';
import React from 'react';

// @todo Support nested values.

const generateFormName = paths => paths.join('][');

const isObject = item =>
  item && typeof item === 'object' && !Array.isArray(item);

/**
 * Deep merge two objects.
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

const configSchemaToReactComponent = (
  name,
  state,
  configSchema,
  onChangeField,
  parents = [],
) => {
  const configSchemaWithWidgets = mergeDeep(
    {},
    configSchema,
    configSchemaToUiSchema(configSchema),
  );
  const pathName = generateFormName([...parents, name]);
  switch (configSchemaWithWidgets['ui:widget']) {
    case 'textfield':
      return (
        <div key={pathName}>
          <label>
            {configSchema.label}
            <input
              type="textfield"
              onChange={onChangeField(pathName)}
              value={state[pathName]}
            />
          </label>
        </div>
      );
    case 'integer':
      return (
        <div key={pathName}>
          <label>
            {configSchema.label}
            <input
              type="number"
              onChange={onChangeField(pathName)}
              value={state[pathName]}
            />
          </label>
        </div>
      );
    case 'checkbox':
      return (
        <div key={pathName}>
          <label>
            {configSchema.label}
            <input
              type="checkbox"
              onChange={onChangeField(pathName)}
              value={state[pathName]}
            />
          </label>
        </div>
      );
    case 'config_object':
      return (
        <div key={'root'}>
          <fieldset>
            {Object.entries(configSchema.mapping).map(pair =>
              configSchemaToReactComponent(
                pair[0],
                state,
                pair[1],
                onChangeField,
                [...parents, pair[0]],
              ),
            )}
          </fieldset>
        </div>
      );
    case 'mapping':
      return (
        <div key={pathName}>
          <label>
            {configSchema.label}
            <fieldset>
              {Object.entries(configSchema.mapping).map(pair =>
                configSchemaToReactComponent(
                  pair[0],
                  state,
                  pair[1],
                  onChangeField,
                  [...parents, pair[0]],
                ),
              )}
            </fieldset>
          </label>
        </div>
      );
    case 'hidden':
    default:
      return '';
  }
};

const configSchemaToJsonSchema = (configSchema, parents = []) => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      const properties = {};
      configSchema.mapping.forEach((schema, name) => {
        properties[name] = configSchemaToJsonSchema(schema, [...parents, name]);
      });

      return {
        type: 'object',
        properties: properties,
      };
    case 'string':
      return {
        type: 'string',
      };
    case 'email':
      return {
        type: 'string',
      };
    case 'integer':
      return {
        type: 'integer',
      };
  }
};

const configSchemaToUiSchema = configSchema => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      const properties = {};
      Object.entries(configSchema.mapping).forEach(pair => {
        const name = pair[0];
        const schema = pair[1];
        properties[name] = configSchemaToUiSchema(schema);
      });
      return {
        'ui:widget': configSchema.type,
        mapping: properties,
      };
    case 'uuid':
      return {
        'ui:widget': 'hidden',
      };
    case 'string':
    case 'email':
    case 'label':
    case 'path':
      return {
        'ui:widget': 'textfield',
      };
    case 'integer':
      return {
        'ui:widget': 'integer',
      };
    case 'boolean':
      return {
        'ui:widget': 'checkbox',
      };
    default:
      return {};
  }
};

const objectGet = (path, object) => {
  const paths = Array.isArray(path)
    ? path
    : path.split('][').map(str => str.replace(']', ''));
  if (Array.isArray(path)) {
  } else {
  }
};

const objectSet = (path, object, value) => {
  const paths = Array.isArray(path)
    ? path
    : path.split('][').map(str => str.replace(']', ''));

  if (typeof object[paths[0]] === 'undefined') {
    return;
  }

  if (paths.length > 1) {
    return objectSet(paths.slice(1), object[paths[0]]);
  }

  object[paths[0]] = value;
  return;
};

const fetchSimpleConfig = name => {
  return fetch(
    `${process.env.REACT_APP_DRUPAL_BASE_URL}/config/${name}?_format=json`,
  )
    .then(res => {
      return res.json();
    })
    .catch(console.error);
};

const convertFormValuesToNormalized = object => {
  return object;
};

const convertNormalizedToFormValues = normalized => {
  return normalized;
};

export {
  configSchemaToReactComponent,
  configSchemaToJsonSchema,
  configSchemaToUiSchema,
  fetchSimpleConfig,
};
