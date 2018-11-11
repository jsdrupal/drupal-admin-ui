import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { MESSAGE_SEVERITY } from '../../../constants/messages';

const styles = {
  message: css`
    padding: 20px 25px;
    margin-bottom: 30px;
    color: #fff;
  `,
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
};

const modifierClassMap = new Map([
  [MESSAGE_SEVERITY.ERROR, styles.error],
  [MESSAGE_SEVERITY.SUCCESS, styles.success],
  [MESSAGE_SEVERITY.WARNING, styles.warning],
  [MESSAGE_SEVERITY.INFO, styles.info],
]);

const Message = ({ message, messageSeverity }) => (
  <div className={`${styles.message} ${modifierClassMap[messageSeverity]}`}>
    {message}
  </div>
);

Message.propTypes = {
  message: PropTypes.string.isRequired,
  messageSeverity: PropTypes.oneOf([
    MESSAGE_SEVERITY.ERROR,
    MESSAGE_SEVERITY.SUCCESS,
    MESSAGE_SEVERITY.INFO,
    MESSAGE_SEVERITY.WARNING,
  ]).isRequired,
};

export default Message;
