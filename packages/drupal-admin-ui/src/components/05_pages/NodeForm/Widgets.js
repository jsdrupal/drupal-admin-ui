import OptionsSelect from 'drupal-ui/build/Widgets/OptionsSelect';
import NumberTextfield from 'drupal-ui/build/Widgets/NumberTextfield';
import StringTextfield from 'drupal-ui/build/Widgets/StringTextfield';
import BooleanCheckbox from 'drupal-ui/build/Widgets/BooleanCheckbox';
import DatetimeTimestamp from 'drupal-ui/build/Widgets/DatetimeTimestamp';
import FileUploadWidget from 'drupal-ui/build/Widgets/FileUploadWidget';
import EntityReferenceAutocomplete from 'drupal-ui/build/Widgets/EntityReferenceAutocomplete';
import TextTextarea from 'drupal-ui/build/Widgets/TextTextarea';

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
