import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';

import BooleanCheckbox from './BooleanCheckbox';
import FileUploadWidget from './FileUploadWidget';
import NumberTextfield from './NumberTextfield';
import OptionsSelect from './OptionsSelect';
import StringTextfield from './StringTextfield';
import TimestampDatetime from './TimestampDatetime';

const mockOnChange = e => {
  e.preventDefault();
};

storiesOf('Widgets/BooleanCheckbox', module).addWithJSX('Default', () => (
  <BooleanCheckbox
    fieldName="ControlOne"
    label="CheckBox"
    onChange={mockOnChange}
  />
));
storiesOf('Widgets/FileUploadWidget', module).addWithJSX('Default', () => (
  <FileUploadWidget
    bundle="node"
    entityTypeId="Article"
    fieldName="image-file"
    label="File to be uploaded"
    onChange={mockOnChange}
    value={{
      data: { uuid: [{ value: '1234' }] },
      meta: { alt: 'This is an alternative.' },
    }}
  />
));

storiesOf('Widgets/NumberTextfield', module).addWithJSX('Default', () => (
  <NumberTextfield
    fieldName="textField"
    label="0-9 in steps of 1"
    inputProps={{
      min: 0,
      max: 9,
      step: 1,
      value: 5,
    }}
    onChange={mockOnChange}
  />
));

storiesOf('Widgets/OptionsSelect', module).addWithJSX('Default', () => (
  <OptionsSelect
    fieldName="option"
    helpText="Help text."
    label="A Simple Label"
    onChange={mockOnChange}
    schema={{ enum: ['One', 'Two', 'Three', 'Four'], default: 'Two' }}
    value="Entered text."
  />
));
storiesOf('Widgets/StringTextfield', module).addWithJSX('Default', () => (
  <StringTextfield
    fieldName="userBio"
    label="A Simple Label"
    onChange={mockOnChange}
    value="Entered text."
  />
));

storiesOf('Widgets/TimestampDatetime', module).addWithJSX('Default', () => (
  <TimestampDatetime
    fieldName="EventStart"
    label="A Simple Label"
    name="startTime"
    onChange={mockOnChange}
    value="0"
  />
));
