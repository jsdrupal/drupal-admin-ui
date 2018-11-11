import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from 'emotion';
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

import OpsModalButton from '../../02_atoms/OpsModalButton/OpsModalButton';

import { contentDelete } from '../../../actions/content';

const styles = {
  noContentMessage: css`
    padding: 0 1.5rem 1.5rem;
  `,
};

class ContentTable extends React.Component {
  static propTypes = {
    contentTypes: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
    contentList: PropTypes.arrayOf(PropTypes.object).isRequired,
    contentDelete: PropTypes.func.isRequired,
    pageChangeHandler: PropTypes.func.isRequired,
    tableSortHandler: PropTypes.func.isRequired,
    setChecked: PropTypes.func.isRequired,
    includes: PropTypes.shape({
      'user--user': PropTypes.object,
    }).isRequired,
    links: PropTypes.shape({
      next: PropTypes.string,
    }).isRequired,
    page: PropTypes.shape({
      offset: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
    }).isRequired,
    sort: PropTypes.shape({
      path: PropTypes.string.isRequired,
      direction: PropTypes.oneOf(['DESC', 'ASC']).isRequired,
    }).isRequired,
    checked: PropTypes.objectOf(PropTypes.bool).isRequired,
  };

  selectAll(checked) {
    this.props.setChecked(
      (checked &&
        this.props.contentList
          .map(({ attributes: { nid } }) => nid)
          .reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: true,
            }),
            {},
          )) ||
        {},
    );
  }

  render() {
    const {
      links,
      contentList,
      page: { offset, limit },
    } = this.props;
    // Calculate the highest known count.
    const count = offset + contentList.length + (links.next ? 1 : 0);

    return (
      <div
        ref={node => {
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
                .map(({ key, label, sortable }) =>
                  sortable ? (
                    <TableCell key={key}>
                      <TableSortLabel
                        direction={
                          this.props.sort.path === key
                            ? this.props.sort.direction.toLowerCase()
                            : undefined
                        }
                        active={this.props.sort.path === key}
                        onClick={this.props.tableSortHandler(
                          key,
                          (this.props.sort.path !== key && 'DESC') ||
                            ((this.props.sort.direction === 'DESC' && 'ASC') ||
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
            {this.props.contentList.map(node => {
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
