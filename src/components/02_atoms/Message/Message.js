import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';

export const MESSAGE_ERROR = 'MESSAGE_ERROR';
export const MESSAGE_SUCCESS = 'MESSAGE_SUCCESS';

let styles;
let modifierClassMap;

const Message = ({ message, type }) => (
  <div className={`${styles.message} ${modifierClassMap[type]}`}>{message}</div>
);

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf([MESSAGE_ERROR, MESSAGE_SUCCESS]),
};

Message.defaultProps = {
  type: MESSAGE_ERROR,
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
  [MESSAGE_ERROR]: styles.error,
  [MESSAGE_SUCCESS]: styles.success,
};

export default Message;
