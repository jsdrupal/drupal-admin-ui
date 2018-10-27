import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';
import { css } from 'emotion';

import Typography from '@material-ui/core/Typography';

const styles = {
  title: css`
    margin: 10px 3px 40px;
  `,
};

const PageTitle = ({ children }) => (
  <Typography variant="h4" classes={{ root: styles.title }}>
    {children}
  </Typography>
);

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

const reducePropsToState = propsList => {
  const innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.children;
  }

  return null;
};

/**
 * Set the title of the page based on the children of PageTitle.
 *
 * @param  {(String|Array)} title
 *   Title may be an array if the number children is > 1
 */
const handleStateChangeOnClient = title => {
  document.title = (Array.isArray(title) ? title : [title])
    .map(e => (e && typeof e === 'string' ? e.trim() : ''))
    .join(' ');
};

export default withSideEffect(reducePropsToState, handleStateChangeOnClient)(
  PageTitle,
);
