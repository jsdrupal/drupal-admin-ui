import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { string, shape, func, arrayOf } from 'prop-types';
import { Markup } from 'interweave';
import { css } from 'emotion';
import { StickyContainer, Sticky } from 'react-sticky';

import {
  setMessage,
  clearMessage,
  MESSAGE_SUCCESS,
} from '../../../actions/application';
import Loading from '../../02_atoms/Loading/Loading';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';
import api from '../../../utils/api/api';
import { requestPermissions } from '../../../actions/permissions';
import { requestRoles } from '../../../actions/roles';
import { cancelTask } from '../../../actions/helpers';

export const filterPermissions = (input, permissions) =>
  permissions.filter(
    ({ title, description, provider, provider_label: providerLabel }) =>
      `${title}${description}${provider}${providerLabel}`
        .toLowerCase()
        .includes(input.toLowerCase()),
  );

let styles;

const Permissions = class Permissions extends Component {
  state = {
    loaded: false,
    permissions: [],
    changedRoles: [],
    filter: '',
    working: false,
  };
  componentDidMount() {
    this.props.requestPermissions();
    this.props.requestRoles();
  }
  componentWillUnmount() {
    this.props.cancelTask();
  }
  onPermissionCheck = (roleName, permission) => {
    this.setState(prevState => ({
      ...prevState,
      changedRoles: Array.from(
        new Set(prevState.changedRoles).add(roleName).values(),
      ),
      roles: this.togglePermission(
        permission,
        roleName,
        prevState.roles || this.props.roles,
      ),
    }));
    this.props.clearMessage();
  };

  sortAdminRoles = (roles, matchedRole) =>
    matchedRole &&
    roles.map(role => role.attributes.id).includes(this.props.match.params.role)
      ? roles.filter(
          role => role.attributes.id === this.props.match.params.role,
        )
      : roles.sort((a, b) => {
          if (a.attributes.is_admin && b.attributes.is_admin) {
            return a.attributes.id - b.attributes.id;
          } else if (a.attributes.is_admin) {
            return 1;
          } else if (b.attributes.is_admin) {
            return -1;
          }
          return a.attributes.id - b.attributes.id;
        });

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
                  <input type="checkbox" checked disabled="disabled" />
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
    const filter = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      filter,
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
                  MESSAGE_SUCCESS,
                );
              }),
            ),
        ),
    );
  };
  render() {
    if (this.state.err) {
      throw new Error('Error while loading page');
    } else if (!this.props.roles || !this.props.permissions) {
      return <Loading />;
    }
    const sortedRoles = this.sortAdminRoles(
      this.props.roles,
      this.props.match.params.role,
    );
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
              ...sortedRoles.map(({ attributes: { label } }) => label),
            ]}
          />
          <TBody
            rows={this.createTableRows(
              this.groupPermissions(
                filterPermissions(this.state.filter, this.props.permissions),
              ),
              sortedRoles,
            )}
          />
        </Table>
      </StickyContainer>
    );
  }
};

Permissions.propTypes = {
  setMessage: func.isRequired,
  cancelTask: func.isRequired,
  clearMessage: func.isRequired,
  match: shape({
    params: shape({
      role: string,
    }).isRequired,
  }).isRequired,
  roles: arrayOf(shape({})),
  permissions: arrayOf(
    shape({
      provider: string.isRequired,
      title: string.isRequired,
      description: string,
    }),
  ),
  requestPermissions: func.isRequired,
  requestRoles: func.isRequired,
};

Permissions.defaultProps = {
  roles: null,
  permissions: null,
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

const mapStateToProps = state => ({
  roles: state.application.roles,
  permissions: state.application.permissions,
});

export default connect(mapStateToProps, {
  setMessage,
  cancelTask,
  clearMessage,
  requestPermissions,
  requestRoles,
})(Permissions);
