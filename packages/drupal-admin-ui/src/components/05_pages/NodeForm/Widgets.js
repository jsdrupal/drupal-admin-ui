import OptionsSelect from 'drupal-admin-ui-components/build/Widgets/OptionsSelect';
import NumberTextfield from 'drupal-admin-ui-components/build/Widgets/NumberTextfield';
import StringTextfield from 'drupal-admin-ui-components/build/Widgets/StringTextfield';
import BooleanCheckbox from 'drupal-admin-ui-components/build/Widgets/BooleanCheckbox';
import DatetimeTimestamp from 'drupal-admin-ui-components/build/Widgets/DatetimeTimestamp';
import FileUploadWidget from 'drupal-admin-ui-components/build/Widgets/FileUploadWidget';
import EntityReferenceAutocomplete from 'drupal-admin-ui-components/build/Widgets/EntityReferenceAutocomplete';
import TextTextarea from 'drupal-admin-ui-components/build/Widgets/TextTextarea';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: {
    component: OptionsSelect,
  },
  number: {
    component: NumberTextfield,
  },
  string: {
    component: StringTextfield,
  },
  boolean_checkbox: {
    component: BooleanCheckbox,
  },
  datetime_timestamp: {
    component: DatetimeTimestamp,
  },
  image_image: {
    component: FileUploadWidget,
    multiple: true,
  },
  entity_reference_autocomplete: {
    component: EntityReferenceAutocomplete,
    multiple: true,
  },
  text_textarea: {
    component: TextTextarea,
  },
};

export default widgets;
