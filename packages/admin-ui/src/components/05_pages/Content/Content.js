import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

import LoadingBar from 'react-redux-loading-bar';

import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import PageTitle from '../../02_atoms/PageTitle';
import ContentTable from '../../04_templates/ContentTable/ContentTable';

import ConfirmationDialog from './ConfirmationDialog';

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
    margin: 1rem 0 0.5rem 0.5rem;
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
  noContentMessage: css`
    padding: 0 1.5rem 1.5rem;
  `,
  textField: css`
    width: 300px;
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
    status: null,
    sort: { path: 'changed', direction: 'DESC' },
    page: {
      offset: 0,
      limit: 50,
    },
    action: null,
    checked: {},
    dialogVisibility: false,
  };

  componentDidMount() {
    this.props.requestContentTypes();
    this.props.requestContent(this.state);
    this.props.requestActions();
  }

  dialogOpen = () => this.setState({ dialogVisibility: true });

  dialogClose = () =>
    this.setState({ dialogVisibility: false, action: null, checked: {} });

  executeAction = () => {
    const matchingAction = this.props.actions.filter(
      action => action.attributes.id === this.state.action,
    )[0];
    this.props.actionExecute(matchingAction, Object.keys(this.state.checked));
    this.setState({ checked: {}, action: null });
  };

  tableSortHandler = (path, direction) => () => {
    this.setState(
      prevState => ({
        sort: { path, direction },
        page: { offset: 0, limit: prevState.page.limit },
      }),
      () => {
        this.props.requestContent(this.state);
      },
    );
  };

  pageChangeHandler = (event, page) => {
    this.setState(
      ({ page: { limit } }) => ({
        page: { offset: page * limit, limit },
      }),
      () => {
        this.props.requestContent(this.state);
      },
    );
  };

  render = () => (
    <div className={styles.root}>
      <PageTitle>Content</PageTitle>
      <LoadingBar style={{ position: 'relative', marginBottom: '5px' }} />
      <Paper>
        {this.props.contentTypes && this.props.actions.length && (
          <Fragment>
            <div className={styles.filters}>
              {/* @TODO Get rid of duplicated condition */}
              {this.props.contentTypes && this.props.actions.length && (
                <Fragment>
                  <TextField
                    inputProps={{ 'aria-label': 'Title' }}
                    label="Title"
                    placeholder="Title"
                    className={styles.textField}
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
                      data-nightwatch="content-type-select"
                      onChange={e => {
                        this.setState({ contentTypes: e.target.value }, () => {
                          this.props.requestContent(this.state);
                        });
                      }}
                      input={
                        <Input
                          name="content-type"
                          id="select-multiple-checkbox"
                        />
                      }
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

                  <div>
                    <FormControl
                      className={styles.action}
                      disabled={
                        Object.values(this.state.checked).filter(Boolean)
                          .length === 0 || false
                      }
                    >
                      <InputLabel htmlFor="action">Actions</InputLabel>
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
                          <MenuItem
                            key={action.id}
                            value={action.attributes.id}
                          >
                            {action.attributes.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {this.state.action &&
                      Object.values(this.state.checked).filter(Boolean)
                        .length !== 0 && (
                        <Fragment>
                          <Button
                            // onClick={this.executeAction}
                            onClick={this.dialogOpen}
                            color="primary"
                            variant="contained"
                          >
                            Apply
                          </Button>
                          <ConfirmationDialog
                            action={this.state.action}
                            actions={this.props.actions}
                            checked={this.state.checked}
                            contentList={this.props.contentList}
                            dialogVisibility={this.state.dialogVisibility}
                            handleClose={this.dialogClose}
                            executeAction={this.executeAction}
                          />
                        </Fragment>
                      )}
                  </div>
                </Fragment>
              )}

              <Fab
                color="primary"
                aria-label="add"
                className={styles.addButton}
                component={Link}
                to="/node/add"
              >
                <AddIcon />
              </Fab>
            </div>
            <ContentTable
              pageChangeHandler={this.pageChangeHandler}
              tableSortHandler={this.tableSortHandler}
              links={this.props.links}
              contentList={this.props.contentList}
              page={this.state.page}
              includes={this.props.includes}
              sort={this.state.sort}
              contentTypes={this.props.contentTypes}
              checked={this.state.checked}
              setChecked={values => {
                this.setState({ checked: values });
              }}
            />
          </Fragment>
        )}
      </Paper>
    </div>
  );
}

const mapStateToProps = state => ({
  contentTypes: state.application.contentTypes,
  contentList: state.content.contentList,
  includes: state.content.includes,
  links: state.content.links,
  actions:
    (state.application.actions &&
      state.application.actions.filter(action =>
        SUPPORTED_ACTIONS.includes(action.attributes.plugin),
      )) ||
    [],
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
