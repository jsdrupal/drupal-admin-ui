import { css } from 'emotion';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


import OpsModalButton from '../../02_atoms/OpsModalButton/OpsModalButton';
import ContentType from '../../05_pages/Content/Content';

import { Content, contentDelete } from '../../../actions/content';

const styles = {
  button: css``,
  noContentMessage: css`
    padding: 0 1.5rem 1.5rem;
  `,
};

export enum Direction {
  ASC= 'ASC',
  DESC = 'DESC',
};

interface ContentType {
  name: string,
  description: string,
};

interface RelationShips {
  uid: {
    data: {
      id: string,
    }
  }
};

interface Prop {
  contentTypes: ContentType[]
  contentList: Array<{}>,
  contentDelete: (node: Content) => any,
  pageChangeHandler: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => any,
  tableSortHandler: (key: string, direction: string) => any,
  // TODO must lock down.
  setChecked: (x: object) => any,
  includes: {'user--user': object},
  links: {next: string},
  page: {offset: number, limit: number },
  sort: {path: string, direction: Direction},
  checked: boolean[],
};

class ContentTable extends React.Component<Prop> {

  public selectAll(checked: boolean) {
    this.props.setChecked(
      (checked &&
        this.props.contentList.map(({ attributes: { nid } }: {attributes:{nid: string}}) => nid).reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: true,
          }),
          {},
        )) ||
        {},
    );
  }

  public render() {
    const {
      links,
      contentList,
      page: { offset, limit },
    } : Prop = this.props;
    // Calculate the highest known count.
    const count = offset + contentList.length + (links.next ? 1 : 0);

    return (
      <div
        ref={(node: HTMLDivElement) : void => {
          // TODO this.table set set but never used .. remove?
          // @ts-ignore
          this.table = node;
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {
                <TableCell padding="checkbox">
                  <Checkbox
                    id="selectAll"
                    onChange={(event, checked) => this.selectAll(checked)}
                    inputProps={{ 'aria-label': 'select all content' }}
                  />
                </TableCell>
              }
              {[
                { key: 'title', label: 'Title', sortable: true },
                {
                  key: 'type',
                  label: 'Content Type',
                  sortable: true,
                },
                this.props.includes['user--user']
                  ? {
                      key: 'author',
                      label: 'Author',
                      sortable: false,
                    }
                  : undefined,
                { key: 'status', label: 'Status', sortable: true },
                { key: 'changed', label: 'Updated', sortable: true },
                {
                  key: 'operations',
                  label: 'Operations',
                  sortable: false,
                },
              ]
                .filter(x => x)
                .map(
                  // @ts-ignore
                  ({ key, label, sortable }) =>
                    sortable ? (
                      <TableCell key={key}>
                        <TableSortLabel
                          // @ts-ignore
                          direction={
                            this.props.sort.path === key
                              ? this.props.sort.direction.toLowerCase()
                              : undefined
                          }
                          active={this.props.sort.path === key}
                          onClick={this.props.tableSortHandler(
                            key,
                            (this.props.sort.path !== key && Direction.ASC) ||
                              ((this.props.sort.direction === Direction.DESC &&
                                'ASC') ||
                                'DESC'),
                          )}
                        >
                          {label}
                        </TableSortLabel>
                      </TableCell>
                    ) : (
                      <TableCell key={key}>{label}</TableCell>
                    ),
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.contentList.map((node: {
              type: string,
              id: string,
              attributes: {
                changed: number,
                nid: string,
                status: boolean,
                title: string,
              },
              links: string[],
              relationships: RelationShips,
            }) => {
              const {
                type,
                attributes: { changed, nid, status, title },
                relationships,
              } = node;
              const rowSelectId = `row-select-for-${String(nid)}`;
              return (
                <TableRow key={nid}>
                  {
                    <TableCell padding="checkbox">
                      <Checkbox
                        id={rowSelectId}
                        value={String(nid)}
                        onChange={(event, checked) => {
                          this.props.setChecked(
                            (() => {
                              // Clone the object to not change the props directly.
                              const nextChecked = JSON.parse(
                                JSON.stringify(this.props.checked),
                              );
                              nextChecked[nid] = checked;
                              return nextChecked;
                            })(),
                          );
                        }}
                        checked={this.props.checked[nid] || false}
                      />
                    </TableCell>
                  }
                  <TableCell>
                    <Link to={`/node/${nid}`}>
                      <label htmlFor={rowSelectId}>{title}</label>
                    </Link>
                  </TableCell>
                  <TableCell>{this.props.contentTypes[type].name}</TableCell>
                  {this.props.includes['user--user'] && (
                    <TableCell>
                      {this.props.includes['user--user'][
                        relationships.uid.data.id
                      ] ? (
                        <Link
                          to={`/user/${
                            this.props.includes['user--user'][
                              relationships.uid.data.id
                            ].attributes.uid
                          }`}
                        >
                          {
                            this.props.includes['user--user'][
                              relationships.uid.data.id
                            ].attributes.name
                          }
                        </Link>
                      ) : (
                        'Anonymous (not verified)'
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {(status && 'Published') || 'Unpublished'}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat(navigator.language, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(changed * 1000))}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      aria-label="edit"
                      className={styles.button}
                      component={Link}
                      data-nightwatch={`Edit ${title}`}
                      // This looks like a bug typescript report to is not a valid props.
                      // @ts-ignore
                      to={`/node/${nid}/edit`}
                    >
                      <EditIcon />
                    </IconButton>
                    <OpsModalButton
                      aria-label="delete"
                      className={styles.button}
                      title={`Are you sure that you want to delete this content ${title}?`}
                      text="This action cannot be undone."
                      cancelText="Cancel"
                      confirmText="Delete"
                      enterAction={() => {
                        this.props.contentDelete(node);
                      }}
                    >
                      <DeleteIcon />
                    </OpsModalButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={limit}
          page={offset / limit}
          onChangePage={this.props.pageChangeHandler}
          rowsPerPageOptions={[limit]}
          labelDisplayedRows={({ page }) => `Page: ${page + 1}`}
          nextIconButtonProps={{ 'aria-label': 'Next content page.' }}
          backIconButtonProps={{
            'aria-label': 'Previous content page.',
          }}
        />
        {!this.props.contentList.length && (
          <Typography className={styles.noContentMessage}>
            There is no content yet. {<Link to="/node/add">Add one</Link>}.
          </Typography>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { contentDelete },
)(ContentTable);
