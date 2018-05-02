import React, { Component, Fragment } from 'react';
import { func, arrayOf, object, string, shape, number } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import { requestContent } from '../../../actions/content';
import { cancelTask } from '../../../actions/helpers';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

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
    nodes.map(({ changed, nid, status, title, type }) => ({
      key: `row-${nid}`,
      tds: [
        [`td-${nid}-title`, title],
        [`td-${nid}-content-type`, type],
        [`td-${nid}-author`, ''],
        [`td-${nid}-status`, (status && 'Published') || 'Unpublished'],
        [`td-${nid}-updated`, changed],
        [`td-${nid}-actions`, <Link to={`/node/${nid}/edit`}>Edit</Link>],
      ],
    }));
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
        <label htmlFor="select-type">
          Content type
          <select
            id="select-type"
            key="select-type"
            label="Type"
            multiple
            size={this.props.nodeTypes.length}
            onChange={this.typeFilterHandler}
            selected={this.props.filterOptions.types}
          >
            {this.props.nodeTypes.map(({ name, type }) => (
              <option value={type} key={type}>
                {name}
              </option>
            ))}
          </select>
        </label>
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
          <THead
            data={[
              'Title',
              'Content Type',
              'Author',
              'Status',
              'Updated',
              'Edit',
            ]}
          />
          <TBody rows={this.createTableRows(this.props.nodes)} />
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
