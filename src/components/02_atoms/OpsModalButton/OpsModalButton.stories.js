import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import EditIcon from '@material-ui/icons/Edit';

import OpsModalButton from './OpsModalButton';

storiesOf('OpsModalButton', module).addWithJSX('Default', () => (
  <OpsModalButton
    aria-label="edit"
    title="Are you sure that you want to edit this element?"
    text="This action cannot be undone."
    cancelText="Cancel"
    confirmText="Edit"
    enterAction={() => {
    }}
  >
    <EditIcon />
  </OpsModalButton>
));
