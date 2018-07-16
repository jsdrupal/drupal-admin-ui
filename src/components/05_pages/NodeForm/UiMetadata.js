// @todo make drupal return this
const UiMetadata = {
  title: {
    widget: 'string_textfield',
    constraints: [],
  },
  created: {
    widget: 'timestamp_datetime',
    constraints: [],
  },
  field_image: {
    widget: 'image_image',
    constraints: [],
  },
  field_preparation_time: {
    widget: 'number_textfield',
    constraints: [],
  },
  field_cooking_time: {
    widget: 'number_textfield',
    constraints: [],
  },
  field_number_of_servings: {
    widget: 'number_textfield',
    constraints: [],
  },
  field_difficulty: {
    widget: 'options_select',
    constraints: [],
  },
  status: {
    widget: 'boolean_checkbox',
    constraints: [],
  },
};

export default UiMetadata;
