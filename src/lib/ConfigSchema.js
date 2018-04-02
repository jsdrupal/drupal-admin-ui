import React from 'react';

/**
 * There are some major functions:
 *  - configSchemaToReactComponent: takes a config schema and output a react form for that
 *  - configSchemaToJsonSchema : Takes a config schema and converts it to a schema for the data stored in the config
 *  - configSchemaToUiSchema: Takes a config schema and enhances it with information like the widget.
 */

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
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return mergeDeep(target, ...sources);
}

export const objectGet = (path, object) => {
  if (typeof object[path[0]] === 'undefined') {
    return undefined;
  }

  if (path.length > 1) {
    return objectGet(path.slice(1), object[path[0]]);
  }

  return object[path[0]];
};

export const objectSet = (path, object, value) => {
  if (path.length === 1) {
    object[path[0]] = value;
    return undefined;
  }
  if (typeof object[path[0]] === 'undefined') {
    if (Number.isInteger(path[0])) {
      object[path[0]] = [];
    } else {
      object[path[0]] = {};
    }
  }
  return objectSet(path.slice(1), object[path[0]], value);
};

const mapObject = (func, object) =>
  Object.entries(object).reduce((acc, [name, value]) => ({
    ...acc,
    [name]: func(value),
  }));

/**
 * Provides UI schema based upon config schema.
 *
 * This method applies default ui widgets.
 */
const configSchemaToUiSchema = configSchema => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      return {
        'ui:widget': configSchema.type,
        mapping: mapObject(configSchemaToUiSchema, configSchema.mapping),
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
    // Ensure that custom UI widget defined in the schema win.
    configSchemaToUiSchema(configSchema),
    configSchema,
  );
  const pathName = generateFormName([...parents, name]);
  switch (configSchemaWithWidgets['ui:widget']) {
    case 'textfield':
      return (
        <div key={pathName}>
          <label htmlFor={pathName}>
            {configSchema.label}
            <input
              name={pathName}
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
          <label htmlFor={pathName}>
            {configSchema.label}
            <input
              name={pathName}
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
          <label htmlFor={pathName}>
            {configSchema.label}
            <input
              name={pathName}
              type="checkbox"
              onChange={onChangeField([...parents, name])}
              value={objectGet([...parents, name].filter(x => x), state)}
            />
          </label>
        </div>
      );
    case 'config_object':
      return (
        <div key="root">
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
          <label htmlFor={pathName}>
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

const configSchemaToJsonSchema = configSchema => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      return {
        type: 'object',
        properties: mapObject(configSchemaToJsonSchema, configSchema.mapping),
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

export {
  configSchemaToReactComponent,
  configSchemaToJsonSchema,
  configSchemaToUiSchema,
};
