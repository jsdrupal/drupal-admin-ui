import makeCancelable from 'makecancelable';

import React, { Fragment, Component } from 'react';
import Loading from '../../Helpers/Loading';

import {
  TableRow,
  TableData,
  Table,
  TableBody,
  TableHeaderSimple,
} from '../../UI';

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
        <TableBody>
          {this.groupPermissions(this.state.permissions).map(
            ([permissionGroupName, permissions]) =>
              permissions.length && (
                <Fragment key={`fragment-${permissionGroupName}`}>
                  <TableRow key={`permissionGroup-${permissionGroupName}`}>
                    <TableData colSpan={this.state.roles.length + 1}>
                      <b>{permissionGroupName}</b>
                    </TableData>
                  </TableRow>
                  {permissions.map(permission => (
                    <TableRow
                      key={`permissionGroup-${permissionGroupName}-${
                        permission.title
                      }`}
                    >
                      <TableData>{permission.title}</TableData>
                      {this.state.roles.map(({ attributes }) => (
                        <TableData
                          key={`role-${attributes.id}-permission-${
                            permission.id
                          }`}
                        >
                          {attributes.is_admin &&
                          attributes.id === 'administrator' ? (
                            <input type="checkbox" checked />
                          ) : (
                            <input
                              type="checkbox"
                              checked={attributes.permissions.includes(
                                permission.id,
                              )}
                            />
                          )}
                        </TableData>
                      ))}
                    </TableRow>
                  ))}
                </Fragment>
              ),
          )}
        </TableBody>
      </Table>
    );
  }
};

export default Permissions;
