import React, { Component, Fragment } from 'react';
import makeCancelable from 'makecancelable';
import { Markup } from 'interweave';

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
          `${
            process.env.REACT_APP_DRUPAL_BASE_URL
          }/admin-api/permissions?_format=json`,
        ).then(res => res.json()),
        fetch(
          `${
            process.env.REACT_APP_DRUPAL_BASE_URL
          }/jsonapi/user_role/user_role`,
        ).then(res => res.json()),
      ])
        .then(([permissions, { data: roles }]) =>
          this.setState({
            rawPermissions: Object.keys(permissions).map(
              key => permissions[key],
            ),
            renderablePermissions: Object.keys(permissions).map(
              key => permissions[key],
            ),
            changedRoles: [],
            // Move admin roles to the right.
            roles: roles.sort((a, b) => {
              if (a.attributes.is_admin && b.attributes.is_admin) {
                return a.attributes.id - b.attributes.id;
              }
              else if (a.attributes.is_admin) {
                return 1;
              }
              else if (b.attributes.is_admin) {
                return -1;
              }
              else {
                return a.attributes.id - b.attributes.id;
              }
            }),
            loaded: true,
          }),
        )
        .catch(err => this.setState({ loaded: false, err })),
    );
  }
  componentWillUnmount() {
    this.cancelFetch();
  }
  groupPermissions = permissions =>
    Object.entries(
      permissions.reduce((acc, cur) => {
        acc[cur.provider] = acc[cur.provider] || [];
        acc[cur.provider].push(cur);
        return acc;
      }, {}),
    );

  togglePermission = (permission, roleName, roles) => {
    let roleIndex = roles.map(role => role.attributes.id).indexOf(roleName);
    let role = roles[roleIndex];
    const index = role.attributes.permissions.indexOf(permission);
    if (index !== -1) {
      role.attributes.permissions.splice(index, 1);
    } else {
      role.attributes.permissions.push(permission);
    }
    roles[roleIndex] = role;
    return roles;
  };

  onPermissionCheck = (roleName, permission) => {
    this.setState((prevState, props) => {
      return {
        changedRoles: [
          ...new Set(prevState.changedRoles).add(roleName).values(),
        ],
        roles: this.togglePermission(permission, roleName, prevState.roles),
      };
    });
  };

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
            <Markup content={permission.title} />,
            ...roles.map(
              ({ attributes }) =>
                attributes.is_admin && attributes.id === 'administrator' ? (
                  <input type="checkbox" checked />
                ) : (
                  <input
                    type="checkbox"
                    onChange={e =>
                      this.onPermissionCheck(attributes.id, permission.id)
                    }
                    checked={attributes.permissions.includes(permission.id)}
                  />
                ),
            ),
          ],
        })),
      ]),
    );
  handleKeyPress = event => {
    const input = event.target.value.toLowerCase();
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: prevState.rawPermissions.filter(
        ({ title, description, provider, provider_label }) =>
          `${title}${description}${provider}${provider_label}`.includes(input),
      ),
    }));
  };
  render() {
    return !this.state.loaded ? (
      <Loading />
    ) : (
      <Fragment>
        <input
          type="text"
          placeholder="Filter by name, description or module"
          onChange={this.handleKeyPress}
          onKeyDown={this.handleKeyPress}
        />
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
              this.groupPermissions(this.state.renderablePermissions),
              this.state.roles,
            )}
          />
        </Table>
      </Fragment>
    );
  }
};

export default Permissions;
