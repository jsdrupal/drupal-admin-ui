import immutable from "immutable";
import React from 'react';

const configSchemaToReactComponent = (name, state, configSchema, onChangeField) => {
  const configSchemaWithWidgets = immutable.fromJS(configSchema).mergeDeep(configSchemaToUiSchema(configSchema)).toJS();
  switch (configSchemaWithWidgets['ui:widget']) {
    case 'textfield':
      return (
        <div key={name}>
          <label>
            {configSchema.label}
            <input type="textfield" name={name} onChange={onChangeField(name)} value={state[name]}/>
          </label>
        </div>
      );
    case 'integer':
      return (
        <div key={name}>
          <label>
            {configSchema.label}
            <input type="number" name={name} onChange={onChangeField(name)} value={state[name]}/>
          </label>
        </div>
      );
    case 'checkbox':
      return (
        <div key={name}>
          <label>
            {configSchema.label}
            <input type="checkbox" name={name} onChange={onChangeField(name)} value={state[name]}/>
          </label>
        </div>
      );
    case 'config_object':
      return (
        <div key={'root'}>
          <fieldset>
            {Object.entries(configSchema.mapping).map(pair => configSchemaToReactComponent(pair[0], state, pair[1], onChangeField))}
          </fieldset>
        </div>
      );
    case 'mapping':
      return (
        <div key={name}>
          <label>
            {configSchema.label}
            <fieldset>
              {Object.entries(configSchema.mapping).map(pair => configSchemaToReactComponent(pair[0], state, pair[1], onChangeField))}
            </fieldset>
          </label>
        </div>
      );
    case 'hidden':
    default:
      return '';
  }
};

const configSchemaToJsonSchema = (configSchema) => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      const properties = {};
      configSchema.mapping.forEach((schema, name) => {
        properties[name] = configSchemaToJsonSchema(schema);
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

const configSchemaToUiSchema = (configSchema) => {
  switch (configSchema.type) {
    case 'mapping':
    case 'config_object':
      const properties = {};
      Object.entries(configSchema.mapping).forEach(pair=> {
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

const fetchSimpleConfig = (name) => {
  return fetch(`${process.env.REACT_APP_DRUPAL_BASE_URL}/config/${name}?_format=json`)
    .then(res => {
      return res.json();
    })
    .catch(console.error);
};

export {
  configSchemaToReactComponent,
  configSchemaToJsonSchema,
  configSchemaToUiSchema,
  fetchSimpleConfig,
};
