import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';

import FileUpload from './FileUpload';

storiesOf('FileUpload', module).addWithJSX('Default', () => (
  <FileUpload
    entityTypeId="node"
    bundle="Article"
    fieldName="upload"
    onFileUpload={() => {}}
  />
));
