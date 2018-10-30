import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';

import { cancelTask } from '../../../actions/helpers';
import { requestRoles } from '../../../actions/roles';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

export const Roles = class Roles extends Component {
  public componentDidMount() {
    this.props.requestRoles();
  }

  public componentWillUnmount() {
    this.props.cancelTask();
  }

  public createTableRows = roles =>
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

  public render = () => {
    if (!this.props.roles) {
      return <LoadingBar />;
    }
    return (
      <Table>
        <THead data={['NAME', 'OPERATIONS']} />
        <TBody rows={this.createTableRows(this.props.roles)} />
      </Table>
    );
  };
};

Roles.propTypes = {
  requestRoles: PropTypes.func.isRequired,
  cancelTask: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.object),
};

Roles.defaultProps = {
  roles: [],
};

const mapStateToProps = ({ application: { roles } }) => ({
  roles,
});

export default connect(
  mapStateToProps,
  { requestRoles, cancelTask },
)(Roles);
