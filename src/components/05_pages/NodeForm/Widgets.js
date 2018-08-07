import OptionsSelect from '../../02_atoms/Widgets/OptionsSelect';
import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';
import TimestampDatetime from '../../02_atoms/Widgets/TimestampDatetime';
import FileUploadWidget from '../../02_atoms/Widgets/FileUploadWidget';
import EntityReferenceAutocomplete from '../../02_atoms/Widgets/EntityReferenceAutocomplete';
import TextArea from '../../02_atoms/Widgets/TextArea';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: OptionsSelect,
  number_textfield: NumberTextfield,
  string_textfield: StringTextfield,
  boolean_checkbox: BooleanCheckbox,
  timestamp_datetime: TimestampDatetime,
  image_image: FileUploadWidget,
  text_textarea: TextArea,
  entity_reference_autocomplete: EntityReferenceAutocomplete,
};

export default widgets;
