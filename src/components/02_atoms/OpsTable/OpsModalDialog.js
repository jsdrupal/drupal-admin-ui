import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const OpsModalDialog = props => {
  const {
    open,
    title,
    text,
    cancelText,
    confirmText,
    handleClose,
    enterAction,
  } = props;
  const transition = p => <Slide direction="up" {...p} />;

  return (
    <Dialog open={open} TransitionComponent={transition} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            enterAction();
            handleClose();
          }}
          color="primary"
        >
          {confirmText}
        </Button>
        <Button onClick={handleClose} color="primary">
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OpsModalDialog.defaultProps = {
  title: '',
  text: '',
  cancelText: '',
  confirmText: '',
  handleClose: () => {},
  enterAction: () => {},
};

OpsModalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  handleClose: PropTypes.func,
  enterAction: PropTypes.func,
};

export default OpsModalDialog;
