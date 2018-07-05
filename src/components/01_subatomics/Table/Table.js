import React from 'react';
import { css, cx } from 'emotion';
import PropTypes from 'prop-types';

let styles;

const TABLE = ({ children, ...props }) => (
  <table className={styles.table} {...props}>
    {children}
  </table>
);
TABLE.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const TR = ({ children, ...props }) => <tr {...props}>{children}</tr>;
TR.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const TD = ({ children, ...props }) => <td {...props}>{children}</td>;
TD.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const THEAD = ({ data }) => (
  <thead>
    <TR className={styles.tr}>
      {data.map(label => (
        <TD className={styles.td} key={`column-${label}`}>
          {label}
        </TD>
      ))}
    </TR>
  </thead>
);
THEAD.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const TBODY = ({ rows }) => (
  <tbody className={styles.tbody}>
    {rows.map(({ colspan, tds, key }) => (
      <TR key={key} className={styles.tr}>
        {tds.map(([tdKey, tdValue, tdClassName]) => (
          <TD
            className={cx(styles.td, tdClassName || '')}
            key={tdKey}
            colSpan={colspan || undefined}
          >
            {tdValue}
          </TD>
        ))}
      </TR>
    ))}
  </tbody>
);
TBODY.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      colspan: PropTypes.number,
      key: PropTypes.string,
      tds: PropTypes.arrayOf(PropTypes.node).isRequired,
    }),
  ).isRequired,
};

styles = {
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

export { TR, TD, TABLE as Table, TBODY as TBody, THEAD as THead };
