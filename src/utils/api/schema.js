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

export { createEntity }; // eslint-disable-line
