import NumberTextfield from '../../02_atoms/Widgets/NumberTextfield';
import StringTextfield from '../../02_atoms/Widgets/StringTextfield';
import OptionsSelect from '../../02_atoms/Widgets/OptionsSelect';

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  number_textfield: NumberTextfield,
  string_textfield: StringTextfield,
  options_select: OptionsSelect,
};

export default widgets;
