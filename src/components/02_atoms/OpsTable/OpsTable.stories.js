import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { text } from '@storybook/addon-knobs/react';

import EditIcon from '@material-ui/icons/Edit';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import OpsTable from './OpsTable';
import OpsModalButton from './OpsModalButton';

storiesOf('OpsTable', module).addWithJSX('Default', () => (
  <OpsTable>
    <TableHead>
      <TableRow>
        <TableCell>Title</TableCell>
        <TableCell>Operations</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Push button to see the modal pop up.</TableCell>
        <TableCell>
          <OpsModalButton
            aria-label="edit"
            title={text(
              'title',
              'Are you sure that you want to edit this element?',
            )}
            text={text('text', 'This action cannot be undone.')}
            cancelText={text('cancelText', 'Cancel')}
            confirmText={text('confirmText', 'Edit')}
            enterAction={() => {}}
          >
            <EditIcon />
          </OpsModalButton>
        </TableCell>
      </TableRow>
    </TableBody>
  </OpsTable>
));
