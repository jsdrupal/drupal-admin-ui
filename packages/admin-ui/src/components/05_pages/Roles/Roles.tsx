import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';

import { cancelTask } from '../../../actions/helpers';
import { requestRoles } from '../../../actions/roles';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

interface Props {
  requestRoles: () => any;
  cancelTask: () => any;
  roles: [];
}

export class Roles extends Component<Props> {
  public componentDidMount() {
    this.props.requestRoles();
  }

  public componentWillUnmount() {
    this.props.cancelTask();
  }

  public createTableRows = (roles = []) =>
    roles.map(({ attributes: { label, id } }: {attributes: {label: string, id: string}}) => ({
      key: `row-${label}`,
      tds: [
        [`td-${label}`, label],
        [
          `td-${label}-actions`,
          <Link key={label} to={`/admin/people/permissions/${id}`}>Edit Permissions</Link>,
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
        // @ts-ignore
        <TBody rows={this.createTableRows(this.props.roles)} />
      </Table>
    );
  };
};

// @ts-ignore
Roles.defaultProps = {
  roles: [],
};

// @ts-ignore
const mapStateToProps = ({ application: { roles } }: {attributes:{roles: []}}) => ({
  roles,
});

export default connect(
  mapStateToProps,
  { requestRoles, cancelTask },
)(Roles);
