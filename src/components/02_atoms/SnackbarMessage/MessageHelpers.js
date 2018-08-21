import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

let styles;

const MessageSave = ({ bundle, title, nid }) => (
  <Fragment>
    <p>
      <span className={styles.MessageSave.bundle}>{bundle}</span>{' '}
      <em>
        <Link to={`/node/${nid}`}>{title}</Link>
      </em>{' '}
      has been updated
    </p>
  </Fragment>
);

MessageSave.propTypes = {
  bundle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  nid: PropTypes.string.isRequired,
};

styles = {
  MessageSave: {
    bundle: css`
      text-transform: capitalize;
    `,
  },
};

// eslint-disable-next-line
export { MessageSave };
