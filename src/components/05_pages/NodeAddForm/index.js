import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';
import { contentAdd } from '../../../actions/content';

class NodeAddForm extends React.Component {
  onSave = entity => {
    const data = {
      ...entity,
      type: `${this.props.entityTypeId}--${this.props.bundle}`,
    };
    this.props.contentAdd(data);
  };

  render() {
    return (
      <Fragment>
        <PageTitle>Create {this.props.bundle}</PageTitle>
        <LoadingBar />
        <NodeForm {...this.props} onSave={this.onSave} />
      </Fragment>
    );
  }
}

NodeAddForm.propTypes = {
  bundle: PropTypes.string.isRequired,
  contentAdd: PropTypes.func.isRequired,
  entityTypeId: PropTypes.string.isRequired,
};

export default connect(
  null,
  {
    contentAdd,
  },
)(NodeAddForm);
