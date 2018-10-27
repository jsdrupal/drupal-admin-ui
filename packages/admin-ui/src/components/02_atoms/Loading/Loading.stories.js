import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Loading from './Loading';

storiesOf('Loading', module).addWithJSX('Default', () => <Loading />);
