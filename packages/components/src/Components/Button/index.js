import React from 'react';
import { css } from 'emotion';
import Button from '@material-ui/core/Button';

import { colors } from '../../Utils';

const styles = css`
  padding: 1em 1.5em;
  background-color: ${colors.absoluteZero};
  color: ${colors.white};
  &:hover {
    background-color: ${colors.hover};
  }
`;

export default ({ children, variant = 'contained' }) => (
  <Button variant={variant} className={styles}>
    {children}
  </Button>
);
