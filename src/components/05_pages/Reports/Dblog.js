import React, { Component, Fragment } from 'react';
import { func, arrayOf, shape, string, number } from 'prop-types';
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
        wid: number,
        messageFormattedPlain: string,
        timestamp: number,
        type: string,
      }),
    ),
    dbLogEntriesTypes: arrayOf(string),
  };
  static defaultProps = {
    dbLogEntries: null,
    dbLogEntriesTypes: null,
  };
  componentDidMount() {
    this.props.requestDblogCollection();
  }
  generateTableRows = entries =>
    entries.map(({ wid, type, messageFormattedPlain, timestamp }) => ({
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
    }));

  render() {
    if (!this.props.dbLogEntries) {
      return <LoadingBar />;
    }
    return (
      <Fragment>
        <select>
          {this.props.dbLogEntriesTypes.map(type => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <Table>
          <THead data={['Type', 'Date', 'Message', 'User']} />
          <TBody rows={this.generateTableRows(this.props.dbLogEntries)} />
        </Table>
      </Fragment>
    );
  }
};

const mapStateToProps = ({
  application: { dbLogEntries, dbLogEntriesTypes },
}) => ({
  dbLogEntries,
  dbLogEntriesTypes,
});

export default connect(mapStateToProps, { requestDblogCollection })(Dblog);
