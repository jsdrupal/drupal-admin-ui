import * as React from 'react';
import { css } from 'emotion';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { MESSAGE_SEVERITY } from '../../../constants/message_severity';

const variantIcon: Map<MESSAGE_SEVERITY, any> = new Map([
  [MESSAGE_SEVERITY.SUCCESS, CheckCircleIcon],
  [MESSAGE_SEVERITY.WARNING, WarningIcon],
  [MESSAGE_SEVERITY.ERROR, ErrorIcon],
  [MESSAGE_SEVERITY.INFO, InfoIcon],
]);

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

interface Props {
  open: boolean;
  message: string | React.ReactNode;
  messageSeverity: MESSAGE_SEVERITY;
  onClose: () => any;
  duration?: number;
}

const SnackbarMessage = (props: Props) => {
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
            case MESSAGE_SEVERITY.ERROR:
              return styles.error;
            case MESSAGE_SEVERITY.WARNING:
              return styles.warning;
            case MESSAGE_SEVERITY.INFO:
              return styles.info;
            case MESSAGE_SEVERITY.SUCCESS:
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

export default SnackbarMessage;
