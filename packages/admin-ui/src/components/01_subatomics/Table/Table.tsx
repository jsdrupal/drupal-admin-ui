import { css, cx } from 'emotion';
import * as React from 'react';

let styles: {
  table: string
  tbody: string,
  thead: string,
  tr: string,
  td: string,
};

interface TableProps {
  children: React.ReactNode;
}

const TABLE = ({ children, ...props }: TableProps ) => (
  <table className={styles.table} {...props}>
    {children}
  </table>
);

interface TRProps {
  children: React.ReactNode;
  className?: string;
  colsSpan?: number;
}

const TR = ({ children, ...props }: TRProps ) => <tr {...props}>{children}</tr>;

interface TDProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}
const TD = ({ children, ...props }: TDProps ) => <td {...props}>{children}</td>;

const THEAD = ({ data }: {data: string[]}) => (
  <thead>
    <TR className={styles.tr}>
      {data.map((label: string) => (
        <TD className={styles.td} key={`column-${label}`}>
          {label}
        </TD>
      ))}
    </TR>
  </thead>
);

interface TDSFragment {
  tdKey: string;
  tdValue: string;
  tdClassName?: string;
}

interface TBODYProps {
  rows: Array<{
    colspan: number;
    key: string;
    tds: TDSFragment[];
  }>;
}

const TBODY = ({ rows }: TBODYProps) => (
  <tbody className={styles.tbody}>
    {rows.map(({ colspan, tds, key }: {colspan: number, tds: TDSFragment[], key: string}) =>
      (<TR key={key} className={styles.tr}>
        {tds.map(({tdKey, tdValue, tdClassName}: TDSFragment) => (
          <TD
            className={cx(styles.td, tdClassName || '')}
            key={tdKey}
            colSpan={colspan || undefined}
          >
            {tdValue}
          </TD>
        ))})
      </TR>),
    )})
  </tbody>);

styles = {
  table: css``,
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
