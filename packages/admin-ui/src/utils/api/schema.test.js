import { createEntity } from './schema';

it('should return default values.', () => {
  expect(
    createEntity({
      type: 'number',
      default: 123,
    }),
  ).toEqual(123);

  expect(
    createEntity({
      type: 'string',
      default: 'hello world',
    }),
  ).toEqual('hello world');
});

it('should fill default values for objects', () => {
  expect(
    createEntity({
      type: 'object',
      properties: {
        value: {
          type: 'string',
          title: 'Text',
        },
        format: {
          type: 'string',
          title: 'Text format',
          default: 'basic_html',
        },
      },
      required: ['value'],
      title: 'Recipe instruction',
    }),
  ).toEqual({
    value: '',
    format: 'basic_html',
  });
});

// @todo support date and date-time
it('should create default values, if not available', () => {
  expect(
    createEntity({
      type: 'integer',
    }),
  ).toEqual(0);
  expect(
    createEntity({
      type: 'number',
    }),
  ).toEqual(0.0);
  expect(
    createEntity({
      type: 'boolean',
    }),
  ).toEqual(true);
});

it('should create arrays', () => {
  expect(
    createEntity({
      type: 'array',
      title: 'Ingredients',
      description:
        'List the ingredients required for this recipe, one per item.',
      items: {
        type: 'string',
        title: 'Text value',
        maxLength: 255,
      },
    }),
  ).toEqual([]);
});

it('multi value field state is initialized as empty array', () => {
  expect(
    createEntity({
      maxItems: 3,
      title: 'Image',
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                title: 'Resource ID',
              },
              type: {
                type: 'string',
                title: 'Referenced resource',
              },
            },
            required: ['id', 'type'],
          },
        },
      },
    }),
  ).toEqual({ data: [] });
});
