import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
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

export default NodeAddForm;
