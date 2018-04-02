import React, { Component } from 'react';
import { func, arrayOf, shape, string, number, oneOfType } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Markup } from 'interweave';

import { requestDblogCollection } from '../../../actions/reports';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

const Dblog = class Dblog extends Component {
  static propTypes = {
    requestDblogCollection: func.isRequired,
    dbLogEntries: arrayOf(
      shape({
        attributes: shape({
          hostname: string,
          link: oneOfType([() => null, string]),
          location: string,
          message: string,
          message_formatted: string,
          message_formatted_plain: string,
          referer: oneOfType([() => null, string]),
          severity: number,
          timestamp: number,
          type: string,
          variables: string,
          wid: number,
        }),
        id: string,
        links: shape({
          self: string,
        }),
        relationships: shape({
          uid: shape({
            data: shape({
              id: string,
              type: string,
            }),
            links: shape({
              related: string,
              self: string,
            }),
          }),
        }),
        type: string,
      }),
    ),
  };
  static defaultProps = {
    dbLogEntries: null,
  };
  componentDidMount() {
    this.props.requestDblogCollection();
  }
  generateTableRows = entries =>
    entries.map(
      ({
        attributes: {
          wid,
          type,
          message_formatted_plain: messageFormattedPlain,
          timestamp,
        },
      }) => ({
        key: String(wid),
        tds: [
          [`type-${wid}`, type],
          [`timestamp-${wid}`, timestamp],
          [
            `markup-${wid}`,
            <Markup content={`${messageFormattedPlain.substring(0, 48)}…`} />,
          ],
          [`user-${wid}`, ''],
        ],
      }),
    );

  render() {
    if (!this.props.dbLogEntries) {
      return <LoadingBar />;
    }
    return (
      <Table>
        <THead data={['Type', 'Date', 'Message', 'User']} />
        <TBody rows={this.generateTableRows(this.props.dbLogEntries)} />
      </Table>
    );
  }
};

const mapStateToProps = ({ application: { dbLogEntries } }) => ({
  dbLogEntries,
});

export default connect(mapStateToProps, { requestDblogCollection })(Dblog);
