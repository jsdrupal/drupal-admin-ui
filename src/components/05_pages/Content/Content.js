import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  requestContentTypes,
  requestActions,
} from '../../../actions/application';
import {
  requestContent,
  SUPPORTED_ACTIONS,
  actionExecute,
} from '../../../actions/content';

const styles = {
  root: css`
    margin-bottom: 50px;
  `,
  addButton: css`
    margin: 0.5rem;
    position: fixed;
    right: 0;
    bottom: 0;
  `,
  action: css`
    margin: 0.5rem;
    margin-left: 0rem;
    min-width: 8rem;
    max-width: 19rem;
  `,
  formControl: css`
    margin: 0.5rem;
    min-width: 8rem;
    max-width: 19rem;
  `,
  chips: css`
    display: flex;
    flex-wrap: wrap;
  `,
  chip: css`
    margin: 0.5rem;
  `,
  selectEmpty: css`
    margin-top: 0.5rem;
  `,
  button: css`
    margin: 0.5rem;
  `,
  filters: css`
    padding: 0 1.5rem;
  `,
};

class Content extends Component {
  static propTypes = {
    contentTypes: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
    requestContent: PropTypes.func.isRequired,
    requestContentTypes: PropTypes.func.isRequired,
    contentList: PropTypes.arrayOf(PropTypes.object),
    requestActions: PropTypes.func.isRequired,
    actionExecute: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object),
    includes: PropTypes.shape({
      'user--user': PropTypes.object,
    }),
    links: PropTypes.shape({
      next: PropTypes.string,
    }),
  };
  static defaultProps = {
    contentList: [],
    includes: {},
    actions: [],
    links: {},
  };
  state = {
    contentTypes: [],
    scrollToTop: false,
    status: null,
    sort: { path: 'changed', direction: 'DESC' },
    page: {
      offset: 0,
      limit: 50,
    },
    action: null,
    checked: {},
  };
  componentDidMount() {
    this.props.requestContentTypes();
    this.props.requestContent(this.state);
    this.props.requestActions();
  }
  executeAction = () => {
    const action = this.props.actions.filter(
      action => action.attributes.id === this.state.action,
    )[0];
    this.props.actionExecute(action, Object.keys(this.state.checked));
  };
  componentDidUpdate(prevProps) {
    // Operations executed in the bottom of the page should scroll back to top
    // when list content changes. For example, the pagination uses this.
    if (
      this.state.scrollToTop &&
      JSON.stringify(prevProps.contentList) !==
        JSON.stringify(this.props.contentList)
    ) {
      window.scrollTo(0, this.table.offsetTop);
    }
  }
  tableSortHandler = (path, direction) => () => {
    this.setState(
      {
        sort: { path, direction },
        page: { offset: 0, limit: this.state.page.limit },
      },
      () => {
        this.props.requestContent(this.state);
      },
    );
  };
  pageChangeHandler = (event, page) => {
    this.setState(
      ({ page: { limit } }) => ({
        page: { offset: page * limit, limit },
        scrollToTop: true,
      }),
      () => {
        this.props.requestContent(this.state);
      },
    );
  };

  render = () => {
    const {
      page: { offset, limit },
    } = this.state;
    const { links, contentList } = this.props;

    // Calculate the highest known count.
    const count = offset + contentList.length + (links.next ? 1 : 0);

    return (
      <div className={styles.root}>
        <Paper>
          <div className={styles.filters}>
            <TextField
              label="Title"
              placeholder="Title"
              onChange={e => {
                this.setState({ title: e.target.value }, () => {
                  this.props.requestContent(this.state);
                });
              }}
              margin="normal"
            />

            <FormControl className={styles.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox">
                Content Type
              </InputLabel>
              <Select
                multiple
                value={this.state.contentTypes}
                onChange={e => {
                  this.setState({ contentTypes: e.target.value }, () => {
                    this.props.requestContent(this.state);
                  });
                }}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => (
                  <div className={styles.chips}>
                    {selected.map(value => (
                      <Chip
                        key={value}
                        label={this.props.contentTypes[value].name}
                        className={styles.chip}
                      />
                    ))}
                  </div>
                )}
              >
                {Object.keys(this.props.contentTypes).map(type => (
                  <MenuItem key={type} value={type}>
                    <Checkbox
                      checked={this.state.contentTypes.indexOf(type) > -1}
                    />
                    <ListItemText
                      primary={this.props.contentTypes[type].name}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className={styles.formControl}>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                value={this.state.status || ''}
                onChange={e => {
                  this.setState({ status: e.target.value }, () => {
                    this.props.requestContent(this.state);
                  });
                }}
                input={<Input name="status" id="status" />}
                autoWidth
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="unpublished">Unpublished</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="fab"
              color="primary"
              aria-label="add"
              className={styles.addButton}
              component={Link}
              to="/node/add"
            >
              <AddIcon />
            </Button>
          </div>

          <div className={styles.filters}>
            {this.props.actions && (
              <FormControl className={styles.action}>
                <InputLabel htmlFor="actions">Actions</InputLabel>
                <Select
                  value={this.state.action || ''}
                  onChange={e => {
                    this.setState({ action: e.target.value });
                  }}
                  input={<Input name="action" id="action" />}
                  autoWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.props.actions.map(action => (
                    <MenuItem key={action.id} value={action.attributes.id}>
                      {action.attributes.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {this.state.action && (
              <Button
                onClick={this.executeAction}
                color="primary"
                variant="contained"
              >
                Apply
              </Button>
            )}
          </div>

          <div
            ref={node => {
              this.table = node;
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {<TableCell padding="checkbox" />}
                  {[
                    { key: 'title', label: 'Title', sortable: true },
                    { key: 'type', label: 'Content Type', sortable: true },
                    { key: 'author', label: 'Author', sortable: false },
                    { key: 'status', label: 'Status', sortable: true },
                    { key: 'changed', label: 'Updated', sortable: true },
                    { key: 'operations', label: 'Operations', sortable: false },
                  ].map(
                    ({ key, label, sortable }) =>
                      sortable ? (
                        <TableCell key={key}>
                          <TableSortLabel
                            direction={
                              this.state.sort.path === key
                                ? this.state.sort.direction.toLowerCase()
                                : undefined
                            }
                            active={this.state.sort.path === key}
                            onClick={this.tableSortHandler(
                              key,
                              (this.state.sort.path !== key && 'DESC') ||
                                ((this.state.sort.direction === 'DESC' &&
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
                {this.props.contentList.map(
                  ({
                    type,
                    attributes: { changed, nid, status, title },
                    relationships,
                  }) => (
                    <TableRow key={nid}>
                      {
                        <TableCell padding="checkbox">
                          <Checkbox
                            value={String(nid)}
                            onChange={(event, checked) => {
                              this.setState(prevState => {
                                prevState.checked[nid] = checked;
                                return prevState;
                              });
                            }}
                            checked={this.state.checked[nid] || false}
                          />
                        </TableCell>
                      }
                      <TableCell>{title}</TableCell>
                      <TableCell>
                        {this.props.contentTypes[type].name}
                      </TableCell>
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
                          to={`/node/${nid}/edit`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          className={styles.button}
                          component={Link}
                          to={`/node/${nid}/delete`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={count}
              rowsPerPage={limit}
              page={offset / limit}
              onChangePage={this.pageChangeHandler}
              rowsPerPageOptions={[limit]}
              labelDisplayedRows={({ page }) => `Page: ${page + 1}`}
            />
          </div>
        </Paper>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  contentTypes: state.application.contentTypes,
  contentList: state.content.contentList,
  includes: state.content.includes,
  links: state.content.links,
  actions: state.application.actions.filter(action =>
    SUPPORTED_ACTIONS.includes(action.attributes.plugin),
  ),
});

export default connect(
  mapStateToProps,
  {
    requestActions,
    requestContentTypes,
    requestContent,
    actionExecute,
  },
)(Content);
