import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

class SnackbarMessage extends React.Component {
  render() {
    const props = this.props;
    return (
      <Snackbar
        open={props.open}
        message={props.message}
        autoHideDuration={props.duration || 5000}
        onClose={props.onClose}
      />
    );
  }
}

export default SnackbarMessage;
