import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import TimestampDatetime from '../../02_atoms/Widgets/TimestampDatetime';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';


// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  number_textfield: NumberTextfield,
  string_textfield: StringTextfield,
  timestamp_datetime: TimestampDatetime,
  boolean_checkbox: BooleanCheckbox,
};

export default widgets;
