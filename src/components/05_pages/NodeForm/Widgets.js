import OptionsSelect from '../../02_atoms/Widgets/OptionsSelect';
import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';
import DatetimeTimestamp from '../../02_atoms/Widgets/DatetimeTimestamp';
import FileUploadWidget from '../../02_atoms/Widgets/FileUploadWidget';
import EntityReferenceAutocomplete from '../../02_atoms/Widgets/EntityReferenceAutocomplete';
import TextArea from '../../02_atoms/Widgets/TextArea';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: OptionsSelect,
  number: NumberTextfield,
  string: StringTextfield,
  boolean_checkbox: BooleanCheckbox,
  datetime_timestamp: DatetimeTimestamp,
  image_image: FileUploadWidget,
  text_textarea: TextArea,
  entity_reference_autocomplete: EntityReferenceAutocomplete,
};

export default widgets;
