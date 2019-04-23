import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, object, text } from '@storybook/addon-knobs/react';
import figmaDecorator from 'storybook-addon-figma';
/* eslint-enable import/no-extraneous-dependencies */
import InputRadio from './InputRadio';

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

storiesOf('FormElements/InputRadio', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2061%3A2254',
    }),
  )
  .addWithJSX('Default', () => (
    <InputRadio
      checked={false}
      fieldName="ControlRadio"
      error={boolean('Radio: error', false)}
      required={boolean('Radio: required', false)}
      htmlAttributes={object('Radio: htmlAttributes', {
        'data-test': 'test',
      })}
      onChange={onChangeAction}
    >
      {text('Radio: label', 'Input Radio')}
    </InputRadio>
  ))
  .addWithJSX('Checked', () => (
    <InputRadio
      checked
      fieldName="ControlRadio"
      error={boolean('Radio: error', false)}
      required={boolean('Radio: required', false)}
      htmlAttributes={object('Radio: htmlAttributes', {
        'data-test': 'test',
      })}
      onChange={onChangeAction}
    >
      {text('Radio: label', 'Input Radio')}
    </InputRadio>
  ))
  .addWithJSX('Error', () => (
    <InputRadio
      checked={false}
      fieldName="ControlRadio"
      error={boolean('Radio: error', true)}
      required={boolean('Radio: required', true)}
      htmlAttributes={object('Radio: htmlAttributes', {
        'data-test': 'test',
      })}
      onChange={onChangeAction}
    >
      {text('Radio: label', 'Input Radio')}
    </InputRadio>
  ));
