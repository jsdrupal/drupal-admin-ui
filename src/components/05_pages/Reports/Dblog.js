import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Markup } from 'interweave';

import { requestDblogCollection } from '../../../actions/reports';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

const Dblog = class Dblog extends Component {
  componentDidMount() {
    this.props.requestDblogCollection();
  }
  generateTableRows = entries => {
    return entries.map(
      ({
        attributes: {
          wid,
          type,
          message_formatted: messageFormatted,
          timestamp,
        },
      }) => ({
        key: String(wid),
        tds: [
          [`type-${wid}`, type],
          [`timestamp-${wid}`, timestamp],
          [`markup-${wid}`, <Markup content={messageFormatted} />],
          [`user-${wid}`, 'tedbow'],
        ],
      }),
    );
  };
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
