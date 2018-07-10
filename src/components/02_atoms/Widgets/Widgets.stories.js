import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import BooleanCheckbox from './BooleanCheckbox';
import FileUploadWidget from './FileUploadWidget';
import NumberTextfield from './NumberTextfield';
import StringTextfield from './StringTextfield';

storiesOf('Widgets/BooleanCheckbox', module).addWithJSX('Default', () => (
  <FormControlLabel control={<BooleanCheckbox />} label="Checkbox label" />
));
storiesOf('Widgets/FileUploadWidget', module).addWithJSX('Default', () => (
  <FileUploadWidget />
));
storiesOf('Widgets/NumberTextfield', module).addWithJSX('Default', () => (
  <NumberTextfield
    min="0"
    max="9"
    step="1"
    value="5"
    label="0-9 in steps of 1"
  />
));
storiesOf('Widgets/StringTextfield', module).addWithJSX('Default', () => (
  <StringTextfield value="Entered text." label="A Simple label." />
));
