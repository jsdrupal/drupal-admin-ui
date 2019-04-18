import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean, object, text } from '@storybook/addon-knobs/react';

import Label from './Label';

storiesOf('FormElements/Label', module).addWithJSX('Default', () => (
  <Label
    fieldName="ControlOne"
    htmlFor={text('Label: htmlFor', 'test-label-for')}
    error={boolean('Label: error', false)}
    required={boolean('Label: required', false)}
    htmlAttributes={object('Label: htmlAttributes', { 'data-test': 'test' })}
  >
    {text('Label: label', 'Field label')}
  </Label>
));
