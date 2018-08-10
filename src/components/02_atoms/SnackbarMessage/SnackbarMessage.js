import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';

const SnackbarMessage = props => (
  <Snackbar
    open={props.open}
    message={props.message}
    autoHideDuration={props.duration}
    onClose={props.onClose}
  />
);

SnackbarMessage.defaultProps = {
  duration: 5000,
};

SnackbarMessage.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default SnackbarMessage;
