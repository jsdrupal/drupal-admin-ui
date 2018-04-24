import React, { Component } from 'react';
import { func, arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import { requestContent } from '../../../actions/content';
import { cancelTask } from '../../../actions/helpers';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

export const Content = class Content extends Component {
  componentDidMount() {
    this.props.requestContent();
  }
  componentWillUnmount() {
    this.props.cancelTask();
  }
  createTableRows = nodes =>
    nodes.map(({ attributes: { title, nid } }) => ({
      key: `row-${nid}`,
      tds: [
        [`td-${nid}`, title],
        [
          `td-${nid}-actions`,
          <Link to={`/node/${nid}/edit`}>Edit</Link>,
        ],
      ],
    }));
  render = () => {
    if (!this.props.nodes) {
      return <LoadingBar />;
    }
    return (
      <Table>
        <THead data={['Title', 'Edit']} />
        <TBody rows={this.createTableRows(this.props.nodes)} />
      </Table>
    );
  };
};

Content.propTypes = {
  requestContent: func.isRequired,
  cancelTask: func.isRequired,
  nodes: arrayOf(object),
};

Content.defaultProps = {
  nodes: [],
};

const mapStateToProps = ({ application: { nodes } }) => ({
  nodes,
});

export default connect(mapStateToProps, { requestContent, cancelTask })(Content);
