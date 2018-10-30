import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Loading from './Loading';

// Can remove ignore when this is fixed.
// https://github.com/storybooks/addon-jsx/issues/36

// @ts-ignore
storiesOf('Loading', module).addWithJSX('Default', () => <Loading />);
