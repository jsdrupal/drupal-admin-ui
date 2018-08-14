import OptionsSelect from '../../02_atoms/Widgets/OptionsSelect';
import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';
import DatetimeTimestamp from '../../02_atoms/Widgets/DatetimeTimestamp';
import FileUploadWidget from '../../02_atoms/Widgets/FileUploadWidget';
import EntityReferenceAutocomplete from '../../02_atoms/Widgets/EntityReferenceAutocomplete';
import TextTextarea from '../../02_atoms/Widgets/TextTextarea';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: OptionsSelect,
  number: NumberTextfield,
  string: StringTextfield,
  boolean_checkbox: BooleanCheckbox,
  datetime_timestamp: DatetimeTimestamp,
  image_image: FileUploadWidget,
  entity_reference_autocomplete: EntityReferenceAutocomplete,
  text_textarea: TextTextarea,
};

export default widgets;
