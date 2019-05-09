import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, object, text } from '@storybook/addon-knobs/react';
import figmaDecorator from 'storybook-addon-figma';
/* eslint-enable import/no-extraneous-dependencies */
import InputCheckbox from './InputCheckbox';

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

storiesOf('FormElements/InputCheckbox', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2061%3A2386',
    }),
  )
  .addWithJSX('Default', () => (
    <InputCheckbox
      checked={false}
      fieldName="ControlCheckbox"
      error={boolean('Checkbox: error', false)}
      required={boolean('Checkbox: required', false)}
      htmlAttributes={object('Checkbox: htmlAttributes', {
        'data-test': 'test',
      })}
      onChange={onChangeAction}
    >
      {text('Checkbox: label', 'Input Checkbox')}
    </InputCheckbox>
  ))
  .addWithJSX('Checked', () => (
    <InputCheckbox
      checked
      fieldName="ControlCheckbox"
      error={boolean('Checkbox: error', false)}
      required={boolean('Checkbox: required', false)}
      htmlAttributes={object('Checkbox: htmlAttributes', {
        'data-test': 'test',
      })}
      onChange={onChangeAction}
    >
      {text('Checkbox: label', 'Input Checkbox')}
    </InputCheckbox>
  ));
