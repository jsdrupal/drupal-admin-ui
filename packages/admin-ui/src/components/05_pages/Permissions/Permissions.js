import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import makeCancelable from 'makecancelable';
import { Markup } from 'interweave';
import { css } from 'emotion';
import { StickyContainer, Sticky } from 'react-sticky';

import Loading from '../../02_atoms/Loading/Loading';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

import api from '../../../utils/api/api';
import { MESSAGE_SEVERITY_SUCCESS } from '../../../constants/messages';
import { setMessage, clearMessage } from '../../../actions/application';

export const filterPermissions = (input, permissions) =>
  permissions.filter(
    ({ title, description, provider, provider_label: providerLabel }) =>
      `${title}${description}${provider}${providerLabel}`
        .toLowerCase()
        .includes(input.toLowerCase()),
  );

let styles;

const Permissions = class Permissions extends Component {
  static propTypes = {
    setMessage: PropTypes.func.isRequired,
    clearMessage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        role: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loaded: false,
    rawPermissions: [],
    renderablePermissions: [],
    working: false,
  };

  componentDidMount() {
    this.cancelFetch = this.fetchData();
  }

  componentWillUnmount() {
    this.cancelFetch();
  }

  onPermissionCheck = (roleName, permission) => {
    this.setState(prevState => ({
      changedRoles: [...new Set(prevState.changedRoles).add(roleName).values()],
      roles: this.togglePermission(permission, roleName, prevState.roles),
    }));
    this.props.clearMessage();
  };

  fetchData = () =>
    makeCancelable(
      Promise.all([api('permissions'), api('roles')])
        .then(([permissions, { data: roles }]) =>
          this.setState({
            rawPermissions: permissions,
            renderablePermissions: permissions,
            changedRoles: [],
            working: false,
            // Move admin roles to the right.
            roles:
              this.props.match.params.role &&
              roles
                .map(role => role.attributes.id)
                .includes(this.props.match.params.role)
                ? roles.filter(
                    role => role.attributes.id === this.props.match.params.role,
                  )
                : roles.sort((a, b) => {
                    if (a.attributes.is_admin && b.attributes.is_admin) {
                      return a.attributes.id - b.attributes.id;
                    }
                    if (a.attributes.is_admin) {
                      return 1;
                    }
                    if (b.attributes.is_admin) {
                      return -1;
                    }
                    return a.attributes.id - b.attributes.id;
                  }),
            loaded: true,
          }),
        )
        .catch(err => this.setState({ loaded: false, err })),
    );

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
                <Fragment>
                  <Markup content={permission.title} />
                  {permission['restrict access'] && (
                    <span>
                      <em>
                        {' '}
                        Warning: Give to trusted roles only; this permission has
                        security implications.{' '}
                      </em>
                    </span>
                  )}
                  {permission.description && (
                    <Markup content={` ${permission.description}`} />
                  )}
                </Fragment>,
                css`
                  padding: 0 0 0 30px;
                `,
              ],
              ...roles.map(({ attributes }, index) => [
                `td-${providerMachineName}-${permission.title}-${index}-cb`,
                attributes.is_admin && attributes.id === 'administrator' ? (
                  <input type="checkbox" checked disabled />
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
    const input = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: filterPermissions(input, prevState.rawPermissions),
    }));
  };

  saveRoles = () => {
    this.setState(
      prevState => ({ ...prevState, working: true }),
      () =>
        Promise.all(
          this.state.roles
            .filter(role =>
              this.state.changedRoles.includes(role.attributes.id),
            )
            .map(role =>
              api('role:patch', {
                parameters: {
                  role,
                },
              }).then(() => {
                this.props.setMessage(
                  'Changes have been saved',
                  MESSAGE_SEVERITY_SUCCESS,
                );
              }),
            ),
        ).then(() => {
          this.cancelFetch = this.fetchData();
        }),
    );
  };

  render() {
    if (this.state.err) {
      throw new Error('Error while loading page');
    } else if (!this.state.loaded) {
      return <Loading />;
    }
    return (
      <StickyContainer>
        <Sticky>
          {({ style }) => (
            <div style={style} className={styles.stickyBar}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Filter by name, description or module"
                onChange={this.handleKeyPress}
                onKeyDown={this.handleKeyPress}
              />
              <button
                type="submit"
                key="button-save-roles"
                onClick={this.saveRoles}
                className={styles.saveButton}
                disabled={
                  !this.state.changedRoles.length ||
                  (this.state.working && this.state.changedRoles.length)
                }
              >
                Save
              </button>
            </div>
          )}
        </Sticky>
        <Table>
          <THead
            data={[
              'Permission',
              ...this.state.roles.map(({ attributes: { label } }) => label),
            ]}
          />
          <TBody
            rows={this.createTableRows(
              this.groupPermissions(this.state.renderablePermissions),
              this.state.roles,
            )}
          />
        </Table>
      </StickyContainer>
    );
  }
};

styles = {
  stickyBar: css`
    padding: 1.5rem 0;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
  `,
  saveButton: css`
    float: right;
    color: #333;
    background-color: #fff;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    user-select: none;
    background-image: none;
    border: 1px solid #ccc;
  `,
  searchInput: css`
    color: #555;
    width: 400px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
  `,
};

export default connect(
  null,
  { setMessage, clearMessage },
)(Permissions);
