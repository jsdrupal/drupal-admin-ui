import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_SUCCESS,
} from '../../../constants/messages';

let styles;
let modifierClassMap;

const Message = ({ message, messageSeverity }) => (
  <div className={`${styles.message} ${modifierClassMap[messageSeverity]}`}>
    {message}
  </div>
);

Message.propTypes = {
  message: PropTypes.string.isRequired,
  messageSeverity: PropTypes.oneOf([
    MESSAGE_SEVERITY_ERROR,
    MESSAGE_SEVERITY_SUCCESS,
  ]).isRequired,
};

styles = {
  message: css`
    padding: 20px 25px;
    margin-bottom: 30px;
  `,
  success: css`
    background-color: #d4edda;
  `,
  error: css`
    background-color: #f8d7da;
  `,
};

modifierClassMap = {
  [MESSAGE_SEVERITY_ERROR]: styles.error,
  [MESSAGE_SEVERITY_SUCCESS]: styles.success,
};

export default Message;
