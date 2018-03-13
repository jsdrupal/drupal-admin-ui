import React from 'react';
import { css } from 'emotion';
import {
  node,
  bool,
  oneOfType,
  arrayOf,
  string,
  shape,
  number,
} from 'prop-types';

const TABLE = ({ children, zebra, ...props }) => {
  const styles = css`
    ${zebra ? 'tbody tr:nth-child(odd) {background-color: #e8e8e8;}' : ''};
  `;
  return (
    <table className={styles} {...props}>
      {children}
    </table>
  );
};
TABLE.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
  zebra: bool,
};
TABLE.defaultProps = {
  zebra: false,
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
    <TR>{data.map(label => <TD key={`column-${label}`}>{label}</TD>)}</TR>
  </thead>
);
THEAD.propTypes = {
  data: arrayOf(string).isRequired,
};

const TBODY = ({ rows }) => (
  <tbody>
    {rows.map(({ colspan, tds, key }) => (
      <TR key={key}>
        {tds.map((td, index) => (
          <TD key={`row-td-${index}`} colSpan={colspan ? colspan : undefined}>
            {td}
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

export { TR, TD, TABLE, TBODY, THEAD };
