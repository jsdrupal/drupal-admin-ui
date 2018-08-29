import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = props => <Slide direction="up" {...props} />;

const OpsModalDialog = props => {
  const {
    cancelText,
    confirmText,
    enterAction,
    handleClose,
    open,
    title,
    text,
  } = props;

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
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
  cancelText: '',
  confirmText: '',
  text: '',
  title: '',
};

OpsModalDialog.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  enterAction: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
};

export default OpsModalDialog;
