import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
/* eslint-enable import/no-extraneous-dependencies */
import BannerMessage from './BannerMessage';
import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_SUCCESS,
} from '../../../constants/messages';

const message = "I'm the operator with my pocket calculator.";

storiesOf('BannerMessage', module)
  .addWithJSX('Error', () => (
    <BannerMessage
      message={text('Message', message)}
      type={MESSAGE_SEVERITY_ERROR}
    />
  ))
  .addWithJSX('Success', () => (
    <BannerMessage
      message={text('Message', message)}
      messageSeverity={MESSAGE_SEVERITY_SUCCESS}
    />
  ));
