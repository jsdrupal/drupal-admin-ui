import makeCancelable from 'makecancelable';

import React, { Fragment, Component } from 'react';
import Loading from '../../Helpers/Loading';

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
      <table>
        <thead>
          <tr>
            {[
              'PERMISSION',
              ...this.state.roles.map(({ attributes: { label } }) =>
                label.toUpperCase(),
              ),
            ].map(label => <td key={`column-${label}`}>{label}</td>)}
          </tr>
        </thead>
        <tbody>
          {this.groupPermissions(this.state.permissions).map(
            ([permissionGroupName, permissions]) =>
              permissions.length && (
                <Fragment key={`fragment-${permissionGroupName}`}>
                  <tr key={`permissionGroup-${permissionGroupName}`}>
                    <td colSpan={this.state.roles.length + 1}>
                      <b>{permissionGroupName}</b>
                    </td>
                  </tr>
                  {permissions.map(permission => (
                    <tr
                      key={`permissionGroup-${permissionGroupName}-${
                        permission.title
                      }`}
                    >
                      <td>{permission.title}</td>
                      {this.state.roles.map(({ attributes }) => (
                        <td
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
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ),
          )}
        </tbody>
      </table>
    );
  }
};

export default Permissions;
