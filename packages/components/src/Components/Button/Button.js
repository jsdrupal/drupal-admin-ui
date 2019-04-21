import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import Button from '@material-ui/core/Button';

import { colors } from '../../Utils/colors';

const styles = css`
  padding: 1em 1.5em;
  background-color: ${colors.absoluteZero};
  color: ${colors.white};
  &:hover {
    background-color: ${colors.hover};
  }
`;

const AdminUIButton = ({ children, variant = 'contained' }) => (
  <Button variant={variant} className={styles}>
    {children}
  </Button>
);

AdminUIButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  variant: PropTypes.string.isRequired,
};

export default AdminUIButton;
