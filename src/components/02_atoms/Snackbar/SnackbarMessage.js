import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';

const SnackbarMessage = props => (
  <Snackbar
    open={props.open}
    message={props.message}
    autoHideDuration={props.duration || 5000}
    onClose={props.onClose}
  />
);

SnackbarMessage.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SnackbarMessage;
