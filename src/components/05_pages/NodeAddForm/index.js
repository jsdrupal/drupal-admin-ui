import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import { contentAddChange, contentAdd } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';
import { cleanupRelationships } from '../../../utils/api/content';

class NodeAddForm extends React.Component {
  onSave = entity => {
    this.props.contentAdd(
      cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${this.props.bundle}`,
      }),
      this.props.bundle,
    );
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
  state.content.restorableContentAddByBundle[bundle];

export default connect(
  (state, { bundle }) => ({
    restorableEntity: extractRestorableEntity(state, bundle),
  }),
  {
    contentAdd,
    onChange: contentAddChange,
  },
)(NodeAddForm);
