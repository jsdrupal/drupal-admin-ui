import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import { push } from 'react-router-redux';
import NodeForm from '../NodeForm';
import { contentAddChange, contentAdd } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

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

const extractRestorableEntity = (state, bundle) =>
  state.content.contentAddByBundle[bundle];

export default connect(
  (state, { bundle }) => ({
    restorableEntity: extractRestorableEntity(state, bundle),
  }),
  dispatch => ({
    contentAdd: content => {
      dispatch(contentAdd(content));
      dispatch(push('/admin/content'));
    },
    onChange: contentAddChange,
  }),
)(NodeAddForm);
