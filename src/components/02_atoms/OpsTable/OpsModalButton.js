import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import OpsTableContext from './OpsTableContext';

/* A Drupal specific button, for use in the operations column of a table.
 *
 * Typically a Add, Edit or Delete icon can be provided as a child element
 * see for example  '@material-ui/icons/Add'
 *
 * When pressed a modal dialog slides up into view.
 */
const OpsModalButton = props => {
  // Pass all props except those consumed here down into the button.
  const {
    cancelText,
    confirmText,
    enterAction,
    text,
    title,
    ...buttonProps
  } = props;

  return (
    <OpsTableContext.Consumer>
      {({ openDialog }) => (
        <IconButton
          {...buttonProps}
          onClick={() => {
            openDialog({
              cancelText,
              confirmText,
              enterAction,
              text,
              title,
            });
          }}
        >
          {props.children}
        </IconButton>
      )}
    </OpsTableContext.Consumer>
  );
};

OpsModalButton.propTypes = {
  cancelText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmText: PropTypes.string.isRequired,
  enterAction: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default OpsModalButton;
