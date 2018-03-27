import React, { Component } from 'react';
import { func, arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';
import { requestRoles } from '../../../actions/application';

import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

const Roles = class Roles extends Component {
  componentWillMount() {
    this.props.requestRoles();
  }
  createTableRows = roles =>
    roles.map(({ attributes: { label, id } }) => ({
      key: `row-${label}`,
      tds: [
        [`td-${label}`, label],
        [
          `td-${label}-actions`,
          <Link to={`/admin/people/permissions/${id}`}>Edit Permissions</Link>,
        ],
      ],
    }));
  render = () =>
    !this.props.roles ? (
      <LoadingBar />
    ) : (
      <Table>
        <THead data={['NAME', 'OPERATIONS']} />
        <TBody rows={this.createTableRows(this.props.roles)} />
      </Table>
    );
};

Roles.propTypes = {
  requestRoles: func.isRequired,
  roles: arrayOf(object),
};

Roles.defaultProps = {
  roles: [],
};

const mapStateToProps = ({ application: { roles, error } }) => ({
  roles,
  error,
});

export default connect(mapStateToProps, { requestRoles })(Roles);
