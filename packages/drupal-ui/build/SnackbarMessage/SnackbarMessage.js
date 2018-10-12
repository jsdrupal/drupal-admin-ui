var _templateObject = _taggedTemplateLiteral(['\n    background-color: #43a047;\n  '], ['\n    background-color: #43a047;\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    background-color: #d32f2f;\n  '], ['\n    background-color: #d32f2f;\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    background-color: #1976d2;\n  '], ['\n    background-color: #1976d2;\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    background-color: #ffa000;\n  '], ['\n    background-color: #ffa000;\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    font-size: 20px;\n  '], ['\n    font-size: 20px;\n  ']),
    _templateObject6 = _taggedTemplateLiteral(['\n    margin-right: 10px;\n    opacity 0.9;\n  '], ['\n    margin-right: 10px;\n    opacity 0.9;\n  ']),
    _templateObject7 = _taggedTemplateLiteral(['\n    display: flex;\n    align-items: center;\n\n    a {\n      color: #fff;\n    }\n  '], ['\n    display: flex;\n    align-items: center;\n\n    a {\n      color: #fff;\n    }\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

import { MESSAGE_SEVERITY_ERROR, MESSAGE_SEVERITY_WARNING, MESSAGE_SEVERITY_INFO, MESSAGE_SEVERITY_SUCCESS } from '../../../drupal-admin-ui/src/constants/messages';

var variantIcon = {
  MESSAGE_SEVERITY_SUCCESS: CheckCircleIcon,
  MESSAGE_SEVERITY_WARNING: WarningIcon,
  MESSAGE_SEVERITY_ERROR: ErrorIcon,
  MESSAGE_SEVERITY_INFO: InfoIcon
};

var styles = {
  success: css(_templateObject),
  error: css(_templateObject2),
  info: css(_templateObject3),
  warning: css(_templateObject4),
  icon: css(_templateObject5),
  iconVariant: css(_templateObject6),
  message: css(_templateObject7)
};

var SnackbarMessage = function SnackbarMessage(props) {
  var Icon = variantIcon[props.messageSeverity];
  return React.createElement(
    Snackbar,
    {
      open: props.open,
      autoHideDuration: props.duration,
      onClose: props.onClose,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' }
    },
    React.createElement(SnackbarContent, {
      className: function (severity) {
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
      }(props.messageSeverity),
      message: React.createElement(
        'span',
        { className: styles.message },
        React.createElement(Icon, { className: styles.icon + ' ' + styles.iconVariant }),
        props.message
      ),
      action: [React.createElement(
        IconButton,
        {
          key: 'close',
          'aria-label': 'Close',
          color: 'inherit',
          onClick: props.onClose
        },
        React.createElement(CloseIcon, { className: styles.icon })
      )]
    })
  );
};

SnackbarMessage.defaultProps = {
  duration: 5000
};

SnackbarMessage.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  messageSeverity: PropTypes.oneOf([MESSAGE_SEVERITY_ERROR, MESSAGE_SEVERITY_SUCCESS, MESSAGE_SEVERITY_INFO, MESSAGE_SEVERITY_WARNING]).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default SnackbarMessage;