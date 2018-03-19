import { css } from 'emotion';

export default {
  table: css`
    font: normal 71.3%/1.538em 'Lucida Grande', 'Lucida Sans Unicode',
      'DejaVu Sans', 'Lucida Sans', sans-serif;
  `,
  thead: css``,
  tbody: css`
    tr:hover,
    tr:focus {
      background: #f7fcff;
    }
  `,
  tr: css`
    border-bottom: 1px solid #c7c7c7;
  `,
  td: css`
    padding: 10px 12px;
    text-align: left;
  `,
};
