import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_WARNING,
  MESSAGE_SEVERITY_INFO,
  MESSAGE_SEVERITY_SUCCESS,
} from '../../../constants/messages';

const variantIcon = {
  MESSAGE_SEVERITY_SUCCESS: CheckCircleIcon,
  MESSAGE_SEVERITY_WARNING: WarningIcon,
  MESSAGE_SEVERITY_ERROR: ErrorIcon,
  MESSAGE_SEVERITY_INFO: InfoIcon,
};

const styles = {
  success: css`
    background-color: #43a047;
  `,
  error: css`
    background-color: #d32f2f;
  `,
  info: css`
    background-color: #1976d2;
  `,
  warning: css`
    background-color: #ffa000;
  `,
  icon: css`
    font-size: 20px;
  `,
  iconVariant: css`
    margin-right: 10px;
    opacity 0.9;
  `,
  message: css`
    display: flex;
    align-items: center;

    a {
      color: #fff;
    }
  `,
};

const SnackbarMessage = props => {
  const Icon = variantIcon[props.messageSeverity];
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.duration}
      onClose={props.onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <SnackbarContent
        className={(severity => {
          switch (severity) {
            case MESSAGE_SEVERITY_ERROR:
              return styles.error;
            case MESSAGE_SEVERITY_WARNING:
              return styles.warning;
            case MESSAGE_SEVERITY_INFO:
              return styles.info;
            case MESSAGE_SEVERITY_SUCCESS:
              return styles.success;
            default:
              return styles.error;
          }
        })(props.messageSeverity)}
        message={
          <span className={styles.message}>
            <Icon className={`${styles.icon} ${styles.iconVariant}`} />
            {props.message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={props.onClose}
          >
            <CloseIcon className={styles.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

SnackbarMessage.defaultProps = {
  duration: 5000,
};

SnackbarMessage.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  messageSeverity: PropTypes.oneOf([
    MESSAGE_SEVERITY_ERROR,
    MESSAGE_SEVERITY_SUCCESS,
    MESSAGE_SEVERITY_INFO,
    MESSAGE_SEVERITY_WARNING,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default SnackbarMessage;
