import React, { Component } from 'react';
import makeCancelable from 'makecancelable';
import { Link } from 'react-router-dom';

import Loading from '../../02_atoms/Loading/Loading';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

const Roles = class Roles extends Component {
  state = {
    roles: {},
    loaded: false,
  };
  componentDidMount() {
    this.cancelFetch = makeCancelable(this.fetchData());
  }
  componentWillUnmount() {
    this.cancelFetch();
  }
  fetchData = () =>
    fetch(
      `${process.env.REACT_APP_DRUPAL_BASE_URL}/jsonapi/user_role/user_role`,
      {
        headers: {
          Accept: 'application/vnd.api+json',
        },
        credentials: 'include',
      },
    )
      .then(res => res.json())
      .then(({ data: roles }) =>
        this.setState(prevState => ({ ...prevState, roles, loaded: true })),
      );
  createTableRows = () =>
    this.state.roles.map(({ attributes: { label, id } }) => ({
      key: `row-${label}`,
      tds: [
        [`td-${label}`, label],
        [
          `td-${label}-actions`,
          <Link to={`/admin/people/permissions/${id}`}>Edit Permissions</Link>,
        ],
      ],
    }));
  render() {
    return !this.state.loaded ? (
      <Loading />
    ) : (
      <Table>
        <THead data={['NAME', 'OPERATIONS']} />
        <TBody rows={this.createTableRows()} />
      </Table>
    );
  }
};

export default Roles;
