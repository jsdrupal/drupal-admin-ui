import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import BooleanCheckbox from './BooleanCheckbox';
import FileUploadWidget from './FileUploadWidget';
import NumberTextfield from './NumberTextfield';
import OptionsSelect from './OptionsSelect';
import StringTextfield from './StringTextfield';
import DatetimeTimestamp from './DatetimeTimestamp';

/**
 * There is a known issue with addWithJSX and action() calls.
 *
 *  https://github.com/storybooks/addon-jsx/issues/30
 *
 * To get both the logger to function while still pretty printing sample code
 * in the JSX tab a toSting() method must be provided.
 */
const onChangeAction = action('onChange');
onChangeAction.toString = () => "action('onChange')";

const item = i => {
  const id = `id-${i}`;
  return {
    id: { id },
    file: {
      type: 'file--file',
      url: `url-${i}`,
      id: { id },
    },
    meta: {
      alt: `This is an alternative(${i}).`,
    },
  };
};

storiesOf('Widgets/BooleanCheckbox', module).addWithJSX('Default', () => (
  <BooleanCheckbox
    fieldName="ControlOne"
    label="CheckBox"
    onChange={onChangeAction}
  />
));

storiesOf('Widgets/FileUploadWidget/Single File', module).addWithJSX(
  'Default',
  () => (
    <FileUploadWidget
      bundle="node"
      entityTypeId="Article"
      fieldName="image-file"
      label="File to be uploaded"
      onChange={onChangeAction}
      value={{
        data: item(1),
      }}
      schema={{
        properties: {
          data: {
            type: 'object',
          },
        },
      }}
    />
  ),
);

storiesOf('Widgets/FileUploadWidget/Multiple File', module).addWithJSX(
  'Default',
  () => (
    <FileUploadWidget
      bundle="node"
      entityTypeId="Article"
      fieldName="image-file"
      label="Files to be uploaded"
      onChange={onChangeAction}
      value={{
        data: {
          0: item(10),
          1: item(20),
          2: item(30),
        },
      }}
      schema={{
        maxItems: 10,
        properties: {
          data: {
            type: 'array',
          },
        },
      }}
    />
  ),
);

storiesOf('Widgets/NumberTextfield', module).addWithJSX('Default', () => (
  <NumberTextfield
    fieldName="textField"
    label="0-9 in steps of 1"
    inputProps={{
      min: 0,
      max: 9,
      step: 1,
      suffix: ' for a storybook.',
      prefix: 'interger range',
    }}
    onChange={onChangeAction}
    value="5"
  />
));

storiesOf('Widgets/OptionsSelect', module).addWithJSX('Default', () => (
  <OptionsSelect
    fieldName="option"
    helpText="Help text."
    label="A Simple Label"
    onChange={onChangeAction}
    schema={{ enum: ['One', 'Two', 'Three', 'Four'], default: 'Two' }}
    value="Entered text."
  />
));
storiesOf('Widgets/StringTextfield', module).addWithJSX('Default', () => (
  <StringTextfield
    fieldName="userBio"
    label="A Simple Label"
    onChange={onChangeAction}
    value="Entered text."
  />
));

storiesOf('Widgets/DatetimeTimestamp', module).addWithJSX('Default', () => (
  <DatetimeTimestamp
    fieldName="EventStart"
    label="A Simple Label"
    name="startTime"
    onChange={onChangeAction}
    value="0"
  />
));
