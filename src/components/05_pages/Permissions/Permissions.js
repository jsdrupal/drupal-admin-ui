import React, { Component, Fragment } from 'react';
import makeCancelable from 'makecancelable';
import { Markup } from 'interweave';
import { css } from 'emotion';

import Loading from '../../Helpers/Loading';
import { Table, TBody, THead } from '../../UI/table';

const Permissions = class Permissions extends Component {
  state = {
    loaded: false,
    rawPermissions: [],
    renderablePermissions: [],
  };
  componentDidMount() {
    this.cancelFetch = makeCancelable(
      Promise.all([
        fetch(
          `${
            process.env.REACT_APP_DRUPAL_BASE_URL
          }/admin-api/permissions?_format=json`,
          {
            credentials: 'include',
          },
        ).then(res => res.json()),
        fetch(
          `${
            process.env.REACT_APP_DRUPAL_BASE_URL
          }/jsonapi/user_role/user_role`,
          {
            headers: {
              Accept: 'application/vnd.api+json',
            },
            credentials: 'include',
          },
        ).then(res => res.json()),
      ])
        .then(([permissions, { data: roles }]) =>
          this.setState({
            rawPermissions: permissions,
            renderablePermissions: permissions,
            changedRoles: [],
            // Move admin roles to the right.
            roles: roles.sort((a, b) => {
              if (a.attributes.is_admin && b.attributes.is_admin) {
                return a.attributes.id - b.attributes.id;
              } else if (a.attributes.is_admin) {
                return 1;
              } else if (b.attributes.is_admin) {
                return -1;
              }
              return a.attributes.id - b.attributes.id;
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
  onPermissionCheck = (roleName, permission) => {
    this.setState(prevState => ({
      changedRoles: [...new Set(prevState.changedRoles).add(roleName).values()],
      roles: this.togglePermission(permission, roleName, prevState.roles),
    }));
  };
  togglePermission = (permission, roleName, roles) => {
    const roleIndex = roles.map(role => role.attributes.id).indexOf(roleName);
    const role = roles[roleIndex];
    const index = role.attributes.permissions.indexOf(permission);
    if (index !== -1) {
      role.attributes.permissions.splice(index, 1);
    } else {
      role.attributes.permissions.push(permission);
    }
    roles[roleIndex] = role;
    return roles;
  };
  groupPermissions = permissions =>
    Object.entries(
      permissions.reduce((acc, cur) => {
        acc[cur.provider] = acc[cur.provider] || {
          providerLabel: cur.provider_label,
          permissions: [],
        };
        acc[cur.provider].permissions.push(cur);
        return acc;
      }, {}),
    );
  createTableRows = (groupedPermissions, roles) =>
    [].concat(
      ...groupedPermissions.map(
        ([providerMachineName, { providerLabel, permissions }]) => [
          {
            key: `permissionGroup-${providerMachineName}`,
            colspan: roles.length + 1,
            tds: [[`td-${providerMachineName}`, <b>{providerLabel}</b>]],
          },
          ...permissions.map(permission => ({
            key: `permissionGroup-${providerMachineName}-${permission.title}`,
            tds: [
              [
                `td-${providerMachineName}-${permission.title}`,
                <Markup content={permission.title} />,
                css`
                  padding: 0 0 0 30px;
                `,
              ],
              ...roles.map(({ attributes }, index) => [
                `td-${providerMachineName}-${permission.title}-${index}-cb`,
                attributes.is_admin && attributes.id === 'administrator' ? (
                  <input type="checkbox" checked />
                ) : (
                  <input
                    type="checkbox"
                    onChange={() =>
                      this.onPermissionCheck(attributes.id, permission.id)
                    }
                    checked={attributes.permissions.includes(permission.id)}
                  />
                ),
              ]),
            ],
          })),
        ],
      ),
    );
  handleKeyPress = event => {
    const input = event.target.value.toLowerCase();
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: prevState.rawPermissions.filter(
        ({ title, description, provider, provider_label: providerLabel }) =>
          `${title}${description}${provider}${providerLabel}`.includes(input),
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
        <Table>
          <THead
            data={[
              'PERMISSION',
              ...this.state.roles.map(({ attributes: { label } }) =>
                label.toUpperCase(),
              ),
            ]}
          />
          <TBody
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
