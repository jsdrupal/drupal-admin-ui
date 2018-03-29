import React, { Component } from 'react';
import makeCancelable from 'makecancelable';
import { Link } from 'react-router-dom';

import { MESSAGE_ERROR } from '../../../actions/application';
import Loading from '../../02_atoms/Loading/Loading';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';
import Message from '../../02_atoms/Message/Message';

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
      )
      .catch(err => this.setState({ loaded: true, err }));
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
    if (this.state.err) {
      return <Message message="Error loading roles" type={MESSAGE_ERROR} />;
    } else if (!this.state.loaded) {
      return <Loading />;
    }
    return (
      <Table>
        <THead data={['NAME', 'OPERATIONS']} />
        <TBody rows={this.createTableRows()} />
      </Table>
    );
  }
};

export default Roles;
