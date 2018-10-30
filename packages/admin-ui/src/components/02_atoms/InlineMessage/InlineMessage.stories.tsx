import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
/* eslint-enable import/no-extraneous-dependencies */
import InlineMessage from './InlineMessage';
import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_SUCCESS,
  MESSAGE_SEVERITY_INFO,
  MESSAGE_SEVERITY_WARNING,
} from '../../../constants/messages';

const message = "I'm the operator with my pocket calculator.";


storiesOf('BannerMessage', module)
  // Can remove ignore when this is fixed.
  // https://github.com/storybooks/addon-jsx/issues/36
  // @ts-ignore
  .addWithJSX('Error', () => (
    <InlineMessage
      message={text('Message', message)}
      messageSeverity={MESSAGE_SEVERITY_ERROR}
    />
  ))
  // @ts-ignore
  .addWithJSX('Success', () => (
    <InlineMessage
      message={text('Message', message)}
      messageSeverity={MESSAGE_SEVERITY_SUCCESS}
    />
  ))
  // @ts-ignore
  .addWithJSX('Info', () => (
    <InlineMessage
      message={text('Message', message)}
      messageSeverity={MESSAGE_SEVERITY_INFO}
    />
  ))
  // @ts-ignore
  .addWithJSX('Warning', () => (
    <InlineMessage
      message={text('Message', message)}
      messageSeverity={MESSAGE_SEVERITY_WARNING}
    />
  ));
