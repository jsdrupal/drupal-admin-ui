import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import { contentAddChange, contentAdd } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

class NodeAddForm extends React.Component {
  onSave = entity => {
    this.props.contentAdd(
      this.cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${this.props.bundle}`,
      }),
      this.props.bundle,
    );
  };

  cleanupRelationships = ({ relationships, ...rest }) => ({
    ...rest,
    relationships: Object.entries(relationships).reduce((acc, cur) => {
      const [key, { data: relationshipData }] = cur;
      if (
        typeof relationshipData === 'object' &&
        relationshipData.id &&
        relationshipData.type &&
        relationshipData.id !== '' &&
        relationshipData.type !== ''
      ) {
        acc[key] = { data: relationshipData };
      }
      if (Array.isArray(relationshipData) && relationshipData.length) {
        acc[key] = { data: relationshipData };
      }
      return acc;
    }, {}),
  });

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
  {
    contentAdd,
    onChange: contentAddChange,
  },
)(NodeAddForm);
