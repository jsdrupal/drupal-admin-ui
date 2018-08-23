import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const styles = {
  dialogActionName: css`
    text-transform: lowercase;
  `,
};

const ConfirmationDialog = ({
  action,
  actions,
  checked,
  contentList,
  dialogVisibility,
  handleClose,
  executeAction,
}) => {
  const actionLabel = actions
    .filter(({ attributes: { id } }) => id === action)
    .map(({ attributes: { label } }) => label)
    .shift();
  return (
    <Dialog
      open={dialogVisibility}
      TransitionComponent={props => <Slide direction="up" {...props} />}
      onClose={handleClose}
    >
      <DialogTitle>
        Are you sure you want to{' '}
        <span className={styles.dialogActionName}>{actionLabel}</span> these
        content items?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <ul>
            {contentList
              .filter(({ attributes: { nid } }) =>
                Object.keys(checked).includes(`${nid}`),
              )
              .map(({ attributes: { title, nid } }) => (
                <li key={nid}>{title}</li>
              ))}
          </ul>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            executeAction();
            handleClose();
          }}
          color="primary"
        >
          {actionLabel}
        </Button>
        <Button onClick={handleClose} color="primary">
          <p>Cancel</p>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  action: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  checked: PropTypes.objectOf(PropTypes.bool).isRequired,
  contentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  dialogVisibility: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  executeAction: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
