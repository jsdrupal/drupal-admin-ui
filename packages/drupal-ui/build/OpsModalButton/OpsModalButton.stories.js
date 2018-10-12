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

storiesOf('OpsModalButton', module).add('Default', function () {
  return React.createElement(
    OpsModalButton,
    {
      'aria-label': 'edit',
      title: text('title', 'Are you sure that you want to edit this element?'),
      text: text('text', 'This action cannot be undone.'),
      cancelText: text('cancelText', 'Cancel'),
      confirmText: text('confirmText', 'Edit'),
      enterAction: function enterAction() {}
    },
    React.createElement(EditIcon, null)
  );
}).addDecorator(function (story) {
  return React.createElement(
    Table,
    null,
    React.createElement(
      TableHead,
      null,
      React.createElement(
        TableRow,
        null,
        React.createElement(
          TableCell,
          null,
          'Title'
        ),
        React.createElement(
          TableCell,
          null,
          'Operations'
        )
      )
    ),
    React.createElement(
      TableBody,
      null,
      React.createElement(
        TableRow,
        null,
        React.createElement(
          TableCell,
          null,
          'Push button to see the modal pop up.'
        ),
        React.createElement(
          TableCell,
          null,
          story()
        )
      )
    )
  );
}).addWithJSX('Inside a table column', function () {
  return React.createElement(
    OpsModalButton,
    {
      'aria-label': 'edit',
      title: text('title', 'Are you sure that you want to edit this element?'),
      text: text('text', 'This action cannot be undone.'),
      cancelText: text('cancelText', 'Cancel'),
      confirmText: text('confirmText', 'Edit'),
      enterAction: function enterAction() {}
    },
    React.createElement(EditIcon, null)
  );
});