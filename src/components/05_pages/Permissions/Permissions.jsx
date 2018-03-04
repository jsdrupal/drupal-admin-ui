import React from 'react';
import { css } from 'emotion';

const Permissions = () => (
  <div>
    <h1 className={styles.title}>Permissions</h1>
    <p>This will be the permissions page.</p>
  </div>
);

const styles = {
  title: css`
    text-decoration: underline;
  `,
};

export default Permissions;

