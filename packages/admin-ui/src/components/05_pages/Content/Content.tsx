import { css } from 'emotion';
import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

import LoadingBar from 'react-redux-loading-bar';

import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { Action } from '../../../actions/action';
import { ContentType } from '../../../constants/content_type';

import PageTitle from '../../02_atoms/PageTitle';
import ContentTable from '../../04_templates/ContentTable/ContentTable';
import {Direction} from '../../04_templates/ContentTable/ContentTable';
import ConfirmationDialog from './ConfirmationDialog';

import {
  requestActions,
  requestContentTypes,
} from '../../../actions/application';
import {
  actionExecute,
  requestContent,
  SUPPORTED_ACTIONS,
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
  noContentMessage: css`
    padding: 0 1.5rem 1.5rem;
  `,
  textField: css`
    width: 300px;
  `,
};

interface State {
  action?: string,
  contentTypes?:  ContentType[],
  checked: boolean[],
  dialogVisibility: boolean,
  status: string,
  sort: {
    path: string,
    direction: Direction,
  },
  page: {
    offset: number,
    limit: number,
  }
  title: string,
};

interface ContentProps extends RouteComponentProps {
  // TODO must fix this string body
  contentTypes: ContentType[],
  requestContent: (state: State) => void,
  requestContentTypes: () => void,
  contentList: [],
  requestActions: () => void,
  actionExecute: (action: string, nids: string[]) => any,
  actions: Action[],
  includes: {'user--user': object},
  links: {next: string},
};

class Content extends Component<ContentProps, State> {

  public state = {
    status: '',
    contentList: [],
    sort: { path: 'changed', direction: Direction.DESC },
    page: {
      offset: 0,
      limit: 50,
    },
    action: '',
    checked: [],
    dialogVisibility: false,
    title: '',
  };

  public componentDidMount() {
    this.props.requestContentTypes();
    this.props.requestContent(this.state);
    this.props.requestActions();
  }

  public dialogOpen = (): void => this.setState({ dialogVisibility: true });

  public dialogClose = (): void =>
    this.setState({ dialogVisibility: false, action: undefined, checked: [] });

  public executeAction = (): void => {
    const matchingAction = this.props.actions.filter(
      action => action.attributes.id === this.state.action,
    )[0];
    this.props.actionExecute(matchingAction.attributes.id, Object.keys(this.state.checked));
    this.setState({ checked: [], action: undefined });
  };

  public tableSortHandler = (path: string, direction: Direction) => () => {
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

  public pageChangeHandler = (event: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
    this.setState(
      ({ page: { limit } }) => ({
        page: { offset: page * limit, limit },
      }),
      () => {
        this.props.requestContent(this.state);
      },
    );
  };

  public render = () => (
    <div className={styles.root}>
      <PageTitle>Content</PageTitle>
      <LoadingBar style={{ position: 'relative', marginBottom: '5px' }} />
      <Paper>
        {this.props.contentTypes &&
          this.props.actions && (
            <Fragment>
              <div className={styles.filters}>
                {this.props.contentTypes &&
                  this.props.actions && (
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
                          multiple={true}
                          // TODO There is a but here value is being used as a string
                          // and a structured object.
                          // Must come back and finx.
                          // @ts-ignore
                          value={this.state.contentTypes}
                          data-nightwatch="content-type-select"
                          onChange={e => {
                            this.setState(
                              // @ts-ignore
                              { contentTypes: e.target.value },
                              () => {
                                this.props.requestContent(this.state);
                              },
                            );
                          }}
                          input={
                            <Input
                              name="content-type"
                              id="select-multiple-checkbox"
                            />
                          }
                          renderValue={(selected: []) => (
                            <div className={styles.chips}>
                              {selected.map((value: string) => (
                                <Chip
                                  key={value}
                                  label={this.props.contentTypes[value].name}
                                  className={styles.chip}
                                />
                              ))}
                            </div>
                          )}
                        >
                          {Object.keys(this.props.contentTypes).map((type:string) => (
                            <MenuItem key={type} value={type}>
                              <Checkbox
                                checked={
                                  // TODO must resolve.
                                  // @ts-ignore
                                  this.state.contentTypes.indexOf(type) > -1
                                }
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
                          value={this.state.status}
                          onChange={e => {
                            this.setState({ status: e.target.value }, () => {
                              this.props.requestContent(this.state);
                            });
                          }}
                          input={<Input name="status" id="status" />}
                          autoWidth={true}
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
                            autoWidth={true}
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

                <Button
                  variant="fab"
                  color="primary"
                  aria-label="add"
                  className={styles.addButton}
                  // TODO looks like LINK type is not compatible with
                  // what is needed by component [ missing  'to'?]
                  // @ts-ignore
                  component={Link}
                  to="/node/add"
                >
                  <AddIcon />
                </Button>
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
                setChecked={(values: boolean[]) => {
                  this.setState({ checked: values });
                }}
              />
            </Fragment>
          )}
      </Paper>
    </div>
  );
}

// @ts-ignore
const mapStateToProps = (state) => ({
  contentTypes: state.application.contentTypes,
  contentList: state.content.contentList,
  includes: state.content.includes,
  links: state.content.links,
  // @ts-ignore
  actions: state.application.actions.filter(action =>
    SUPPORTED_ACTIONS.includes(action.attributes.plugin),
  ),
});

export default connect(
  mapStateToProps,
  {
    requestActions,
    requestContentTypes,
    // @ts-ignore
    requestContent,
    actionExecute,
  },
// @ts-ignore
)(Content);
