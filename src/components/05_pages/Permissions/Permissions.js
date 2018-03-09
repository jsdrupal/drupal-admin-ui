import React from 'react';
import { css } from 'emotion';

const styles = {
  title: css`
    text-decoration: underline;
  `,
};

const Permissions = () => (
  <div>
    <h1 className={styles.title}>Permissions</h1>
    <p>This will be the permissions page.</p>
  </div>
);

export default Permissions;
