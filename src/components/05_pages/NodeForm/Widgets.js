import OptionsSelect from '../../02_atoms/Widgets/OptionsSelect';
import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';
import TimestampDatetime from '../../02_atoms/Widgets/TimestampDatetime';
import FileUploadWidget from '../../02_atoms/Widgets/FileUploadWidget';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: OptionsSelect,
  number_textfield: NumberTextfield,
  string_textfield: StringTextfield,
  boolean_checkbox: BooleanCheckbox,
  timestamp_datetime: TimestampDatetime,
  image_image: FileUploadWidget,
};

export default widgets;
