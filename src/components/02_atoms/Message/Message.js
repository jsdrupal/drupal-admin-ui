import React from 'react';
import { css } from 'emotion';
import { string, oneOf } from 'prop-types';

import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../../actions/application';

let styles;
let modifierClassMap;

const Message = ({ message, type }) => (
  <div className={`${styles.message} ${modifierClassMap[type]}`}>{message}</div>
);

Message.propTypes = {
  message: string.isRequired,
  type: oneOf([MESSAGE_ERROR, MESSAGE_SUCCESS]).isRequired,
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
