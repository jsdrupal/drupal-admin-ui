import { Markup } from 'interweave';
import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';

import { requestDblogCollection } from '../../../actions/reports';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

interface Props {
    requestDblogCollection: () => any,
    entries: Array<{
      wid: number,
      messageFormattedPlain: string,
      timestamp: number,
      type: string,
    }>
    availableTypes?: string[],
    filterOptions?: Array<{sort: string, severities: string[], offset: number, types: string[]}>,
    next?: boolean,
};

class Dblog extends Component {
  // static propTypes = {
  //   requestDblogCollection: PropTypes.func.isRequired,
  //   entries: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       wid: PropTypes.number.isRequired,
  //       messageFormattedPlain: PropTypes.string.isRequired,
  //       timestamp: PropTypes.number.isRequired,
  //       type: PropTypes.string.isRequired,
  //     }),
  //   ),
  //   availableTypes: PropTypes.arrayOf(PropTypes.string),
  //   filterOptions: PropTypes.shape({
  //     sort: PropTypes.string,
  //     severities: PropTypes.arrayOf(PropTypes.string),
  //     offset: PropTypes.number,
  //     types: PropTypes.arrayOf(PropTypes.string),
  //   }),
  //   next: PropTypes.bool,
  // };

  public static defaultProps = {
    entries: null,
    availableTypes: null,
    filterOptions: {
      sort: '',
      severities: [],
    },
    next: true,
  };

  public componentDidMount() {
    this.props.requestDblogCollection({
      ...this.props.filterOptions,
      sort: '-timestamp',
    });
  }

  public generateTableRows = entries =>
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

  public severityFilterHandler = e =>
    this.props.requestDblogCollection({
      types: null,
      offset: 0,
      ...this.props.filterOptions,
      severities: Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value),
    });

  public typeFilterHandler = e =>
    this.props.requestDblogCollection({
      severities: null,
      offset: 0,
      ...this.props.filterOptions,
      types: Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value),
    });

  public nextPage = () =>
    this.props.requestDblogCollection({
      severities: null,
      ...this.props.filterOptions,
      offset: (this.props.filterOptions.offset || 0) + 50,
    });

  public previousPage = () =>
    this.props.requestDblogCollection({
      severities: null,
      ...this.props.filterOptions,
      offset: (this.props.filterOptions.offset || 0) - 50,
    });

  public render() {
    if (!this.props.entries) {
      return <LoadingBar />;
    }
    return (
      <Fragment>
        <select
          key="select-type"
          label="Type"
          multiple={true}
          size={this.props.availableTypes.length}
          onBlur={this.typeFilterHandler}
          selected={this.props.filterOptions.types}
        >
          {this.props.availableTypes.map(type => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          key="select-severity"
          label="Severity"
          multiple={true}
          size={8}
          onBlur={this.severityFilterHandler}
          selected={this.props.filterOptions.severities}
        >
          {[
            'Emergency',
            'Alert',
            'Critical',
            'Error',
            'Warning',
            'Notice',
            'Info',
            'Debug',
          ].map((value, index) => (
            <option value={index} key={value}>
              {value}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={this.previousPage}
          disabled={this.props.filterOptions.offset <= 0}
        >
          prev
        </button>
        <button
          type="button"
          onClick={this.nextPage}
          disabled={!this.props.next}
        >
          next
        </button>
        <Table>
          <THead data={['Type', 'Date', 'Message', 'User']} />
          <TBody rows={this.generateTableRows(this.props.entries)} />
        </Table>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ application: { dblog } }) => ({
  filterOptions: {
    offset: 0,
  },
  ...dblog,
});

export default connect(
  mapStateToProps,
  { requestDblogCollection },
)(Dblog);
