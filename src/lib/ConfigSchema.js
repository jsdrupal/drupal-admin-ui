import React from 'react';

// @todo Support nested values.

const generateFormName = paths => paths.join('__');

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

/**
 * @todo Add sequence support
 */
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
              onChange={onChangeField([...parents, name])}
              value={objectGet([...parents, name].filter(x => x), state)}
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
              onChange={onChangeField([...parents, name])}
              value={objectGet([...parents, name].filter(x => x), state)}
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
              onChange={onChangeField([...parents, name])}
              value={objectGet([...parents, name].filter(x => x), state)}
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
                [...parents, name].filter(x => x),
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
                  [...parents, name].filter(x => x),
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
        properties,
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
    default:
      return {};
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

export const objectGet = (path, object) => {
  if (typeof object[path[0]] === 'undefined') {
    return;
  }

  if (path.length > 1) {
    return objectGet(path.slice(1), object[path[0]]);
  }

  return object[path[0]];
};

export const objectSet = (path, object, value) => {
  if (path.length === 1) {
    object[path[0]] = value;
    return;
  } else if (path.length > 1) {
    if (typeof object[path[0]] === 'undefined') {
      if (Number.isInteger(path[0])) {
        object[path[0]] = [];
      } else {
        object[path[0]] = {};
      }
    }
    return objectSet(path.slice(1), object[path[0]], value);
  }
};

export {
  configSchemaToReactComponent,
  configSchemaToJsonSchema,
  configSchemaToUiSchema,
};
