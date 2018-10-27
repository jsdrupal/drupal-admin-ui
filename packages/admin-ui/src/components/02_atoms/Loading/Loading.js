import React from 'react';
import { css, keyframes } from 'emotion';

let rotate = null;
let styles;

const Loading = () => (
  <div className={styles.wrap}>
    <span className={styles.peace} role="img" aria-label="Peace Sign">
      ✌
    </span>
  </div>
);

rotate = keyframes`
  from {
    transform: rotate(-10deg);
  }
  to {
    transform: rotate(10deg);
  }
`;

styles = {
  wrap: css`
    margin: 100px auto 0;
  `,
  peace: css`
    display: inline-block;
    vertical-align: middle;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0, 0, 1, 1);
    transform-origin: bottom;
    font-size: 50px;
    animation-name: ${rotate};
  `,
};

export default Loading;
