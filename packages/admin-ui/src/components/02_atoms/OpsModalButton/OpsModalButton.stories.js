import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { text } from '@storybook/addon-knobs/react';

import EditIcon from '@material-ui/icons/Edit';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import OpsModalButton from './OpsModalButton';

storiesOf('OpsModalButton', module)
  .add('Default', () => (
    <OpsModalButton
      aria-label="edit"
      title={text('title', 'Are you sure that you want to edit this element?')}
      text={text('text', 'This action cannot be undone.')}
      cancelText={text('cancelText', 'Cancel')}
      confirmText={text('confirmText', 'Edit')}
      enterAction={() => {}}
    >
      <EditIcon />
    </OpsModalButton>
  ))
  .addDecorator(story => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Operations</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Push button to see the modal pop up.</TableCell>
          <TableCell>{story()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ))
  .addWithJSX('Inside a table column', () => (
    <OpsModalButton
      aria-label="edit"
      title={text('title', 'Are you sure that you want to edit this element?')}
      text={text('text', 'This action cannot be undone.')}
      cancelText={text('cancelText', 'Cancel')}
      confirmText={text('confirmText', 'Edit')}
      enterAction={() => {}}
    >
      <EditIcon />
    </OpsModalButton>
  ));
