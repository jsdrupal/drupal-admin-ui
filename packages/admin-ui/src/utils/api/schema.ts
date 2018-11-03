export interface Schema {
  default?: any;
  description?: string;
  // TODO is this recursion justified.
  properties?: {[key: string]: Schema};
  items?: {};
  maxItems?: number;
  required?: string[];
  title?: string;
  type: string;
}

const createEntity = (schema: Schema): any=> {
  if (typeof schema.default !== 'undefined') {
    return schema.default;
  }
  switch (schema.type) {
    case 'object':
      if(schema.properties) {
        return Object.entries(schema.properties).reduce(
          (agg, [key, value]) => ({
            ...agg,
            [key]: createEntity(value),
            }),
            {},
          );
        } else {
          // Error condition a schema for a object with no properties.
          // detault to empty object.
          return {};
        }

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
  fieldSchema: Schema[],
  formDisplaySchema: Schema[],
  fieldStorageConfig: Schema[],
  widgets: object,
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
      const widget =
        widgets[
          // @ts-ignore
          Object.keys(widgets)
            .filter(name =>
              formDisplaySchema[currentFieldName].type.startsWith(name),
            )
            .shift()
        ];
      const fieldStorageSettings = fieldStorageConfig
        .filter(
          // @ts-ignore
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
          // @ts-ignore
          ? fieldStorageSettings.attributes.settings
          : {}),
      };
      acc.push({
        // @ts-ignore
        fieldName: currentFieldName,
        // @ts-ignore
        constraints: [],
        widget,
        // @ts-ignore
        inputProps,
      });
      return acc;
    }, []);

const sortUISchemaFields = (schema: Schema[], secondaryColumnFields: string[]) =>
  schema.reduce(
    (acc, curr) => {
      acc[
        // @ts-ignore
        (secondaryColumnFields.includes(curr.fieldName) && 'right') || 'left'
        // @ts-ignore
      ].push(curr);
      return acc;
    },
    { right: [], left: [] },
  );

export { createEntity, createUISchema, sortUISchemaFields };
