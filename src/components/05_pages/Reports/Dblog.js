import React, { Component, Fragment } from 'react';
import { func, arrayOf, shape, string, number } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { Markup } from 'interweave';

import { requestDblogCollection } from '../../../actions/reports';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

const severity = [
  { value: '0', item: 'Emergency' },
  { value: '1', item: 'Alert' },
  { value: '2', item: 'Critical' },
  { value: '3', item: 'Error' },
  { value: '4', item: 'Warning' },
  { value: '5', item: 'Notice' },
  { value: '6', item: 'Info' },
  { value: '7', item: 'Debug' },
];

class Dblog extends Component {
  static propTypes = {
    requestDblogCollection: func.isRequired,
    entries: arrayOf(
      shape({
        wid: number.isRequired,
        messageFormattedPlain: string.isRequired,
        timestamp: number.isRequired,
        type: string.isRequired,
      }),
    ),
    types: arrayOf(string),
    filterOptions: shape({
      sort: string,
      severities: arrayOf(number),
    }),
  };
  static defaultProps = {
    entries: null,
    types: null,
    filterOptions: {
      sort: '',
      severities: [],
    },
  };
  componentDidMount() {
    this.props.requestDblogCollection({
      ...this.props.filterOptions,
      sort: '-timestamp',
    });
  }
  generateTableRows = entries =>
    entries.map(({ wid, type, messageFormattedPlain, timestamp }) => ({
      key: String(wid),
      tds: [
        [`type-${wid}`, type],
        [`timestamp-${wid}`, timestamp],
        [
          `markup-${wid}`,
          <Markup
            content={`${
              messageFormattedPlain.length > 48
                ? `${messageFormattedPlain.substring(0, 48)}…`
                : messageFormattedPlain
            }`}
          />,
        ],
        [`user-${wid}`, ''],
      ],
    }));
  severityFilterHandler = e => {
    const severities = Array.from(e.target.options)
      .filter(option => option.selected)
      .map(option => option.value);
    const { sort } = this.props.filterOptions;
    this.props.requestDblogCollection({
      severities,
      sort,
    });
  };
  render() {
    if (!this.props.entries) {
      return <LoadingBar />;
    }
    return (
      <Fragment>
        <select key="select-type" label="Type">
          {this.props.types.map(type => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          key="select-severity"
          label="Severity"
          multiple
          size={8}
          onChange={this.severityFilterHandler}
          selected={this.props.filterOptions.severities}
        >
          {severity.map(({ value, item }) => (
            <option value={value} key={value}>
              {item}
            </option>
          ))}
        </select>
        <Table>
          <THead data={['Type', 'Date', 'Message', 'User']} />
          <TBody rows={this.generateTableRows(this.props.entries)} />
        </Table>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ application: { dblog } }) => ({
  filterOptions: {},
  ...dblog,
});

export default connect(mapStateToProps, { requestDblogCollection })(Dblog);
