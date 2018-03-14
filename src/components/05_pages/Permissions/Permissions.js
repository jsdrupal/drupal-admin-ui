import React, { Component, Fragment } from 'react';
import makeCancelable from 'makecancelable';

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
            roles,
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
  handleKeyPress = event => {
    const input = event.target.value.toLowerCase();
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: prevState.rawPermissions.filter(({ title }) =>
        title.includes(input),
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
