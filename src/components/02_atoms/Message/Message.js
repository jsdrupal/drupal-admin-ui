import React from 'react';
import { string, oneOf } from 'prop-types';
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from '../../../actions/application';

const typeMap = {
  [MESSAGE_ERROR]: 'error',
  [MESSAGE_SUCCESS]: 'success',
};

const Message = ({ message, type }) => (
  <div className={`message message--${typeMap[type]}`}>
    {message}
  </div>
);

Message.propTypes = {
  message: string.isRequired,
  type: oneOf([MESSAGE_ERROR, MESSAGE_SUCCESS]).isRequired,
};

export default Message;
