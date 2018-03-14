import makeCancelable from 'makecancelable';

import React, { Component } from 'react';
import Loading from '../../Helpers/Loading';

import { Table, TableBody, TableHeaderSimple } from '../../UI';

const Permissions = class Permissions extends Component {
  state = {
    loaded: false,
  };
  componentDidMount() {
    this.cancelFetch = makeCancelable(
      Promise.all([
        fetch(
          `${process.env.REACT_APP_DRUPAL_BASE_URL}/permissions?_format=json`,
        ).then(res => res.json()),
        fetch(
          `${
            process.env.REACT_APP_DRUPAL_BASE_URL
          }/jsonapi/user_role/user_role`,
        ).then(res => res.json()),
      ])
        .then(([permissions, { data: roles }]) =>
          this.setState({ permissions, roles, loaded: true }),
        )
        .catch(err => this.setState({ loaded: false, err })),
    );
  }
  componentWillUnmount() {
    this.cancelFetch();
  }
  groupPermissions = permissions =>
    Object.entries(
      Object.keys(permissions)
        .map(key => permissions[key])
        .reduce((acc, cur) => {
          acc[cur.provider] = acc[cur.provider] || [];
          acc[cur.provider].push(cur);
          return acc;
        }, {}),
    );
  createTableRows = (groupedPermissions, roles) =>
    [].concat(
      ...groupedPermissions.map(([permissionGroupName, permissions]) => [
        {
          key: `permissionGroup-${permissionGroupName}`,
          colspan: roles.length + 1,
          tds: [<b>{permissionGroupName}</b>],
        },
        ...permissions.map(permission => ({
          key: `permissionGroup-${permissionGroupName}-${permission.title}`,
          tds: [
            permission.title,
            ...roles.map(
              ({ attributes }) =>
                attributes.is_admin && attributes.id === 'administrator' ? (
                  <input type="checkbox" checked />
                ) : (
                  <input
                    type="checkbox"
                    checked={attributes.permissions.includes(permission.id)}
                  />
                ),
            ),
          ],
        })),
      ]),
    );
  render() {
    return !this.state.loaded ? (
      <Loading />
    ) : (
      <Table zebra>
        <TableHeaderSimple
          data={[
            'PERMISSION',
            ...this.state.roles.map(({ attributes: { label } }) =>
              label.toUpperCase(),
            ),
          ]}
        />
        <TableBody
          rows={this.createTableRows(
            this.groupPermissions(this.state.permissions),
            this.state.roles,
          )}
        />
      </Table>
    );
  }
};

export default Permissions;
