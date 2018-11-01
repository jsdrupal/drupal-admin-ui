
// @ts-ignore
import { Markup } from 'interweave';
import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';

import { requestDblogCollection } from '../../../actions/reports';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';

interface FilterOptions {
  sort: string, severities?: string[] | null, offset: number, types?: string[] | null,
};

interface Props {
    requestDblogCollection: (options: FilterOptions) => any,
    entries: Array<{
      wid: number,
      messageFormattedPlain: string,
      timestamp: number,
      type: string,
    }>
    availableTypes: string[],
    filterOptions: FilterOptions,
    next?: boolean,
};

class Dblog extends Component<Props> {

  public static defaultProps = {
    entries: null,
    availableTypes: null,
    filterOptions: [],
    next: true,
  };

  public componentDidMount() {
    this.props.requestDblogCollection({
      ...this.props.filterOptions,
      sort: '-timestamp',
    });
  }

  public generateTableRows = (entries: any) =>
    entries.map(({ wid, type, messageFormattedPlain, timestamp }:{wid: string, type:string, messageFormattedPlain: string, timestamp:number}) => ({
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

  public severityFilterHandler = (e: any) =>
    // @ts-ignore
    this.props.requestDblogCollection({
      types: null,
      offset: 0,
      ...this.props.filterOptions,
      severities: Array.from(e.target.options)
        .filter((option: any) => option.selected)
        .map((option: {value:string}) => option.value),
    });

  public typeFilterHandler = (e: any) =>
    // @ts-ignore
    this.props.requestDblogCollection({
      severities: null,
      offset: 0,
      ...this.props.filterOptions,
      types: Array.from(e.target.options)
        .filter((option: any) => option.selected)
        .map((option: {value: string}) => option.value),
    });

  public nextPage = () =>
    // @ts-ignore
    this.props.requestDblogCollection({
      severities: null,
      ...this.props.filterOptions,
      // @ts-ignore
      offset: (this.props.filterOptions.offset || 0) + 50,
    });

  public previousPage = () =>
    // @ts-ignore
    this.props.requestDblogCollection({
      severities: null,
      ...this.props.filterOptions,
      // @ts-ignore
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
          // label="Type"
          multiple={true}
          size={this.props.availableTypes.length}
          onBlur={this.typeFilterHandler}
          //selected={this.props.filterOptions.types}
        >
          {this.props.availableTypes.map((type:string) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          key="select-severity"
          // label="Severity"
          multiple={true}
          size={8}
          onBlur={this.severityFilterHandler}
          // selected={this.props.filterOptions.severities}
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
          // @ts-ignore
          <TBody rows={this.generateTableRows(this.props.entries)} />
        </Table>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ application: { dblog } }: any) => ({
  filterOptions: {
    offset: 0,
  },
  ...dblog,
});

export default connect(
  mapStateToProps,
  { requestDblogCollection },
// @ts-ignore
)(Dblog);
