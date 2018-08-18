import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import { connect } from 'react-redux';
import NodeForm from '../NodeForm';
import { contentAddChange } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

const NodeAddForm = props => (
  <Fragment>
    <PageTitle>Create {props.bundle}</PageTitle>
    <LoadingBar />
    <NodeForm {...props} />
  </Fragment>
);

NodeAddForm.propTypes = {
  bundle: PropTypes.string.isRequired,
};

const extractRestorableEntity = (state, bundle) => {
  return state.content.contentAddByBundle[bundle];
};

export default connect(
  (state, { bundle }) => ({
    restorableEntity: extractRestorableEntity(state, bundle),
  }),
  {
    onChange: contentAddChange,
  },
)(NodeAddForm);
