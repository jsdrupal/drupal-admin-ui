import { css } from 'emotion';
// @ts-ignore... There is no typescript support.
import { Markup } from 'interweave';
// @ts-ignore
import makeCancelable from 'makecancelable';
import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Sticky, StickyContainer } from 'react-sticky';

import { Table, TBody, THead } from '../../01_subatomics/Table/Table';
import Loading from '../../02_atoms/Loading/Loading';

import { clearMessage, setMessage } from '../../../actions/application';
import { MESSAGE_SEVERITY_SUCCESS } from '../../../constants/messages';
import api from '../../../utils/api/api';

interface Permission {
  id: string,
  title: string,
  description: string | null,
  provider_label: string,
  provider: string,
};

interface Role {
  attributes: {
    id: string,
    is_admin: boolean,
    permissions: Permission[],
  }
};

export const filterPermissions = (input: string, permissions: Permission[]) =>
  permissions.filter(
    ({ title, description, provider, provider_label: providerLabel }) =>
      `${title}${description}${provider}${providerLabel}`
        .toLowerCase()
        .includes(input.toLowerCase()),
  );

let styles : {
  stickyBar: string,
  saveButton: string,
  searchInput: string,
}

interface Props {
  setMessage: (message: string, severity: string) => any,
  clearMessage: () => any,
  match: {
    params: {
      role: string,
    }
  }
};
interface State{
  changedRoles: Role[], // TODO must lock down
  loaded?: boolean,
  roles: Role[],
  rawPermissions: Permission[],
  renderablePermissions: Permission[],
  working?: boolean,
  err: string,
};

const Permissions = class Permissions extends Component<Props, State> {

  public state = {
    changedRoles: [],
    loaded: false,
    roles: [],
    rawPermissions: [],
    renderablePermissions: [],
    working: false,
    err: '',
  };

  cancelFetch: () => any;

  public componentDidMount() {
    this.cancelFetch = this.fetchData();
  }

  public componentWillUnmount() {
    this.cancelFetch();
  }

  public onPermissionCheck = (roleName: string, permission: Permission) => {
    this.setState((prevState: State) => ({
      // @ts-ignore
      changedRoles: [...new Set(prevState.changedRoles).add(roleName).values()],
      roles: this.togglePermission(permission, roleName, prevState.roles),
    }));
    this.props.clearMessage();
  };

  public fetchData = () =>
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
                .map((role:Role) => role.attributes.id)
                .includes(this.props.match.params.role)
                ? roles.filter(
                    (role: Role) => role.attributes.id === this.props.match.params.role,
                  )
                : roles.sort((a: Role, b: Role) => {
                    if (a.attributes.is_admin && b.attributes.is_admin) {
                      // @ts-ignore // subtracting strings?
                      return a.attributes.id - b.attributes.id;
                    }
                    if (a.attributes.is_admin) {
                      return 1;
                    }
                    if (b.attributes.is_admin) {
                      return -1;
                    }
                    // @ts-ignore ... subtracting strings.
                    return a.attributes.id - b.attributes.id;
                  }),
            loaded: true,
          }),
        )
        .catch(err => this.setState({ loaded: false, err })),
    );

  public togglePermission = (permission: Permission, roleName: string, roles: Role[]): Role[] => {
    // @ts-ignore
    const roleIndex = roles.map((role: Role) => role.attributes.id).indexOf(roleName);
    const role = roles[roleIndex];
    // @ts-ignore
    const index = role.attributes.permissions.indexOf(permission);
    if (index !== -1) {
      role.attributes.permissions.splice(index, 1);
    } else {
      role.attributes.permissions.push(permission);
    }
    roles[roleIndex] = role;
    return roles;
  };

  public groupPermissions = (permissions: Permission[]) =>
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

  public createTableRows = (groupedPermissions: any, roles: Role[]) =>
    [].concat(
      ...groupedPermissions.map(
        // @ts-ignore
        ([providerMachineName, { providerLabel, permissions }]) => [
          {
            key: `permissionGroup-${providerMachineName}`,
            colspan: roles.length + 1,
            tds: [[`td-${providerMachineName}`, <b>{providerLabel}</b>]],
          },
          ...permissions.map((permission: Permission) => ({
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
<<<<<<< HEAD
                  <input type="checkbox" checked disabled />
=======
                  <input type="checkbox" checked={true} disabled={true} />
>>>>>>> Not yet compiling, many errors marked by TODOs
                ) : (
                  <input
                    type="checkbox"
                    onChange={() =>
                      this.onPermissionCheck(attributes.id, permission)
                    }
                    checked={attributes.permissions.includes(permission)}
                  />
                ),
              ]),
            ],
          })),
        ],
      ),
    );

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: filterPermissions(input, prevState.rawPermissions),
    }));
  };

  public handleKeyPress = (event : React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.key;
    this.setState(prevState => ({
      ...prevState,
      renderablePermissions: filterPermissions(input, prevState.rawPermissions),
    }));
  };

  public saveRoles = () => {
    this.setState(
      prevState => ({ ...prevState, working: true }),
      () =>
        Promise.all(
          this.state.roles
            .filter((role: Role) =>
              // @ts-ignore
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

  public render() {
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
                onChange={this.onChange}
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
