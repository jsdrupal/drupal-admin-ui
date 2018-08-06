// @todo make drupal return this
const UiMetadata = {
  title: {
    widget: 'string_textfield',
    constraints: [],
  },
  field_author: {
    widget: 'entity_reference_autocomplete',
    constraints: [],
  },
  field_preparation_time: {
    widget: 'number_textfield',
    constraints: [],
    inputProps: {
      min: 0,
      max: null,
      prefix: '',
      suffix: ' minutes',
    },
  },
  field_cooking_time: {
    widget: 'number_textfield',
    constraints: [],
    inputProps: {
      min: 0,
      max: null,
      prefix: '',
      suffix: ' minutes',
    },
  },
  field_number_of_servings: {
    widget: 'number_textfield',
    constraints: [],
  },
  field_difficulty: {
    widget: 'options_select',
    constraints: [],
  },
  field_recipe_category: {
    widget: 'entity_reference_autocomplete',
    constraints: [],
  },
  field_tags: {
    widget: 'entity_reference_autocomplete',
    constraints: [],
  },
  field_image: {
    widget: 'image_image',
    constraints: [],
  },
  status: {
    widget: 'boolean_checkbox',
    constraints: [],
  },
  created: {
    widget: 'timestamp_datetime',
    constraints: [],
  },
};

export default UiMetadata;
