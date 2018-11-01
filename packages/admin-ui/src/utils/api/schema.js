const createEntity = schema => {
  if (typeof schema.default !== 'undefined') {
    return schema.default;
  }
  switch (schema.type) {
    case 'object':
      return Object.entries(schema.properties).reduce(
        (agg, [key, value]) => ({
          ...agg,
          [key]: createEntity(value),
        }),
        {},
      );
    case 'array':
      return [];
    case 'string':
      return '';
    case 'number':
      return 0.0;
    case 'integer':
      return 0;
    case 'boolean':
      return true;
    case 'language_reference':
      return null;
    default:
      throw new Error('Unhandled case');
  }
};

const createUISchema = (
  fieldSchema,
  formDisplaySchema,
  fieldStorageConfig,
  widgets,
) =>
  Array.from(
    new Set([...Object.keys(fieldSchema), ...Object.keys(formDisplaySchema)]),
  )
    .filter(
      fieldName =>
        Object.keys(widgets).filter(name =>
          formDisplaySchema[fieldName].type.startsWith(name),
        ).length,
    )
    .sort((a, b) => formDisplaySchema[a].weight - formDisplaySchema[b].weight)
    .reduce((acc, currentFieldName) => {
      const widgetName = Object.keys(widgets)
        .filter(name =>
          formDisplaySchema[currentFieldName].type.startsWith(name),
        )
        .shift();

      const widget = {
        ...widgets[widgetName],
        name: widgetName,
      };
      const fieldStorageSettings = fieldStorageConfig
        .filter(
          ({ attributes: { field_name: fieldName } }) =>
            fieldName === currentFieldName,
        )
        .shift();
      const inputProps = {
        ...(Object.prototype.hasOwnProperty.call(fieldSchema, currentFieldName)
          ? fieldSchema[currentFieldName].attributes.settings
          : {}),
        ...(Object.prototype.hasOwnProperty.call(
          formDisplaySchema,
          currentFieldName,
        )
          ? formDisplaySchema[currentFieldName].settings
          : {}),
        ...(fieldStorageSettings
          ? fieldStorageSettings.attributes.settings
          : {}),
      };
      acc.push({
        fieldName: currentFieldName,
        constraints: [],
        widget,
        inputProps,
      });
      return acc;
    }, []);

const sortUISchemaFields = (schema, secondaryColumnFields) =>
  schema.reduce(
    (acc, curr) => {
      acc[
        (secondaryColumnFields.includes(curr.fieldName) && 'right') || 'left'
      ].push(curr);
      return acc;
    },
    { right: [], left: [] },
  );

export { createEntity, createUISchema, sortUISchemaFields };
