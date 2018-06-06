import React, { Component, Fragment } from 'react';
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

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { requestContentTypes } from '../../../actions/application';
import { requestContent } from '../../../actions/content';

const styles = {
  root: css`
    display: flex;
    flex-wrap: wrap;
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
    includes: PropTypes.shape({
      'user--user': PropTypes.object,
    }),
  };
  static defaultProps = {
    contentList: [],
    includes: {},
  };
  state = {
    contentTypes: [],
    status: null,
  };
  componentDidMount() {
    this.props.requestContentTypes();
    this.props.requestContent();
  }
  render = () => (
    <Fragment>
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
                  <ListItemText primary={this.props.contentTypes[type].name} />
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
        </div>

        <Table>
          <TableHead>
            <TableRow>
              {[
                'Title',
                'Content Type',
                'Author',
                'Status',
                'Updated',
                'Actions',
              ].map(item => <TableCell key={item}>{item}</TableCell>)}
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
                  <TableCell>{title}</TableCell>
                  <TableCell>{this.props.contentTypes[type].name}</TableCell>
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
                  <TableCell>
                    <Button
                      variant="fab"
                      color="secondary"
                      aria-label="edit"
                      className={styles.button}
                      component={Link}
                      to={`/node/${nid}/edit`}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="fab"
                      aria-label="delete"
                      className={styles.button}
                      component={Link}
                      to={`/node/${nid}/delete`}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
    </Fragment>
  );
}

const mapStateToProps = state => ({
  contentTypes: state.application.contentTypes,
  contentList: state.content.contentList,
  includes: state.content.includes,
});

export default connect(mapStateToProps, {
  requestContentTypes,
  requestContent,
})(Content);
