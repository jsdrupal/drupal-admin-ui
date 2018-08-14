import React, { Fragment } from 'react';
import NodeForm from '../NodeForm';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

const NodeAddForm = ({ bundle, ...props }) => (
  <Fragment>
    <PageTitle>Create {bundle}</PageTitle>
    <NodeForm {...props} />
  </Fragment>
);

export default NodeAddForm;
