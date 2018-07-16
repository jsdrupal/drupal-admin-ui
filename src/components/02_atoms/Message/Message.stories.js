import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
/* eslint-enable import/no-extraneous-dependencies */
import Message from './Message';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../../constants/messages';

const message = "I'm the operator with my pocket calculator.";

storiesOf('Message', module)
  .addWithJSX('Error', () => (
    <Message message={text('Message', message)} type={MESSAGE_ERROR} />
  ))
  .addWithJSX('Success', () => (
    <Message message={text('Message', message)} type={MESSAGE_SUCCESS} />
  ));
