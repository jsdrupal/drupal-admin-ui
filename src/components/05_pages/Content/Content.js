import React, { Component, Fragment } from 'react';
import { func, arrayOf, object, string, shape, number } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { requestContent } from '../../../actions/content';
import { cancelTask } from '../../../actions/helpers';

export const Content = class Content extends Component {
  static propTypes = {
    requestContent: func.isRequired,
    cancelTask: func.isRequired,
    nodes: arrayOf(object),
    nodeTypes: arrayOf(
      shape({
        name: string,
        type: string,
      }),
    ),
    filterOptions: shape({
      sort: string,
    }),
    publishedStates: arrayOf(
      shape({
        key: number,
        value: string,
      }),
    ).isRequired,
  };
  static defaultProps = {
    nodes: [],
    nodeTypes: [],
    filterOptions: {
      sort: '',
      severities: [],
    },
  };

  componentDidMount() {
    this.props.requestContent({
      ...this.props.filterOptions,
      sort: 'nid',
    });
  }
  componentWillUnmount() {
    this.props.cancelTask();
  }
  createTableRows = nodes =>
    nodes.map(({ changed, nid, status, title, type }) => (
      <TableRow>
        <TableCell>{title}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell />
        <TableCell>{(status && 'Published') || 'Unpublished'}</TableCell>
        <TableCell>{changed}</TableCell>
        <TableCell>
          <Link to={`/node/${nid}/edit`}>Edit</Link>
        </TableCell>
      </TableRow>
    ));
  typeFilterHandler = e =>
    this.props.requestContent({
      published: null,
      ...this.props.filterOptions,
      types: Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value),
    });
  publishedFilterHandler = e =>
    this.props.requestContent({
      types: null,
      ...this.props.filterOptions,
      published: Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value),
    });
  render = () => {
    if (!this.props.nodes) {
      return <LoadingBar />;
    }
    return (
      <Fragment>
        <FormControl>
          <InputLabel htmlFor="type-filter">Type</InputLabel>
          <Select
            multiple
            value={this.props.filterOptions.types || ['']}
            onChange={this.typeFilterHandler}
            inputProps={{
              id: 'type-filter',
            }}
          >
            {[
              <MenuItem value="" />,
              ...this.props.nodeTypes.map(({ name, type }) => (
                <MenuItem key={type} value={type}>
                  {name}
                </MenuItem>
              )),
            ]}
          </Select>
          <FormHelperText>Select a type.</FormHelperText>
        </FormControl>
        <label htmlFor="select-published">
          Published status
          <select
            id="select-published"
            key="select-published"
            label="Published"
            multiple
            size={2}
            onChange={this.publishedFilterHandler}
            selected={this.props.filterOptions.published}
          >
            {this.props.publishedStates.map(({ key, value }) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <Table>
          <TableHead>
            <TableRow>
              {[
                'Title',
                'Content Type',
                'Author',
                'Status',
                'Updated',
                'Edit',
              ].map(item => <TableCell>{item}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>{this.createTableRows(this.props.nodes)}</TableBody>
        </Table>
      </Fragment>
    );
  };
};

const mapStateToProps = ({ application: { content } }) => ({
  publishedStates: [
    { value: 'Published', key: 1 },
    { value: 'Unpublished', key: 0 },
  ],
  filterOptions: {
    offset: 0,
  },
  ...content,
});

export default connect(mapStateToProps, { requestContent, cancelTask })(
  Content,
);
