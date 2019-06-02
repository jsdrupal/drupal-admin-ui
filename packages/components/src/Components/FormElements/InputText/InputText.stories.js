import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';
import figmaDecorator from 'storybook-addon-figma';
/* eslint-enable import/no-extraneous-dependencies */
import Label from '../Label';
import InputText from './InputText';

/**
 * There is a known issue with addWithJSX and action() calls.
 *
 *  https://github.com/storybooks/addon-jsx/issues/30
 *
 * To get both the logger to function while still pretty printing sample code
 * in the JSX tab a toSting() method must be provided.
 */

storiesOf('FormElements/InputText', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2057%3A1349',
    }),
  )
  .addWithJSX('Default', () => (
    <Label htmlFor="username">
      Label text
      <InputText name="username" required />
    </Label>
  ))
  .addWithJSX('Error', () => (
    <Label htmlFor="username" error>
      Label error
      <InputText name="username" required error />
    </Label>
  ))
  .addWithJSX('Disabled', () => (
    <Label htmlFor="username">
      Label disabled
      <InputText
        name="username"
        disabled
        htmlAttributes={object('InputText: htmlAttributes', {
          disabled: true,
        })}
      />
    </Label>
  ));
