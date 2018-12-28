import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const InitialRedirect = ({ location: { search } }) => {
  // Allow Drupal redirects to determine the initial path.
  const searchString = search
    .replace('?q=', '')
    // trim slashes on the left.
    .replace(/^\//, '');
  if (searchString) {
    return <Redirect to={`/${searchString}`} />;
  }
  return <Redirect to="/" />;
};

InitialRedirect.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default InitialRedirect;
