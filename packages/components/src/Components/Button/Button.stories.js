import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import figmaDecorator from 'storybook-addon-figma';
import { text } from '@storybook/addon-knobs/react';
/* eslint-enable import/no-extraneous-dependencies */
import AdminUIButton from './Button';

const buttonText = 'Button';

storiesOf('AdminUIButton', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=656%3A491',
    }),
  )
  .addWithJSX('Default', () => (
    <AdminUIButton variant="contained">
      {text('Button Text', buttonText)}
    </AdminUIButton>
  ));
