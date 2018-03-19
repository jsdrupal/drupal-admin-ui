import React from 'react';
import { cx } from 'emotion';
import { node, oneOfType, arrayOf, string, shape, number } from 'prop-types';

import tableStyles from './table.style';

const TABLE = ({ children, ...props }) => (
  <table className={tableStyles.table} {...props}>
    {children}
  </table>
);
TABLE.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
};

const TR = ({ children, ...props }) => <tr {...props}>{children}</tr>;
TR.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
};

const TD = ({ children, ...props }) => <td {...props}>{children}</td>;
TD.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
};

const THEAD = ({ data }) => (
  <thead>
    <TR className={tableStyles.tr}>
      {data.map(label => (
        <TD className={tableStyles.td} key={`column-${label}`}>
          {label}
        </TD>
      ))}
    </TR>
  </thead>
);
THEAD.propTypes = {
  data: arrayOf(string).isRequired,
};

const TBODY = ({ rows }) => (
  <tbody className={tableStyles.tbody}>
    {rows.map(({ colspan, tds, key }) => (
      <TR key={key} className={tableStyles.tr}>
        {tds.map(([tdKey, tdValue, tdClassName]) => (
          <TD
            className={cx(tableStyles.td, tdClassName || '')}
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
  rows: arrayOf(
    shape({
      colspan: number,
      key: string,
      tds: arrayOf(node).isRequired,
    }),
  ).isRequired,
};

export { TR, TD, TABLE as Table, TBODY as TBody, THEAD as THead };
