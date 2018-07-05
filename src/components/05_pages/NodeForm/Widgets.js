import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import BooleanCheckbox from '../../02_atoms/Widgets/BooleanCheckbox';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  number_textfield: NumberTextfield,
  string_textfield: StringTextfield,
  boolean_checkbox: BooleanCheckbox,
};

export default widgets;
