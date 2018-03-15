import React from 'react';
import { css } from 'emotion';

const styles = {
  wrap: css`
    margin: 100px auto 0;
  `,
  left: css`
    ::before {
      content: '⬅️';
    }
  `,
  right: css`
    ::before {
      content: '➡️';
    }
  `,
  peace: css`
    ::before {
      content: '✌️';
    }
  `,
};

const Loading = () => (
  <div className={styles.wrap}>
    <span className={styles.left} />
    <span className={styles.peace} />
    <span className={styles.right} />
  </div>
);

export default Loading;
