import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MessageSave = ({ bundle, title, nid }) => (
  <Fragment>
    <p>
      {bundle} <Link to={`/node/${nid}`}>{title}</Link> has been updated
    </p>
  </Fragment>
);

MessageSave.propTypes = {
  bundle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nid: PropTypes.number.isRequired,
};

export default MessageSave;
