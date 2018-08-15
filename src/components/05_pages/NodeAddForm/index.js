import React, { Fragment } from 'react';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

const NodeAddForm = (props) => (
  <Fragment>
    <PageTitle>Create {props.bundle}</PageTitle>
    <LoadingBar />
    <NodeForm {...props} />
  </Fragment>
);

export default NodeAddForm;
