import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import FileUpload from './FileUpload';

/**
 * There is a known issue with addWithJSX and action() calls.
 *
 *  https://github.com/storybooks/addon-jsx/issues/30
 *
 * To get both the logger to function while still pretty printing sample code
 * in the JSX tab a toSting() method must be provided.
 */
const onFileUploadAction = action('onFileUpload');
onFileUploadAction.toString = () => "action('onFileUpload')";

storiesOf('FileUpload', module).addWithJSX('Default', () => (
  <FileUpload
    entityTypeId="node"
    bundle="Article"
    fieldName="upload"
    onFileUpload={onFileUploadAction}
  />
));
