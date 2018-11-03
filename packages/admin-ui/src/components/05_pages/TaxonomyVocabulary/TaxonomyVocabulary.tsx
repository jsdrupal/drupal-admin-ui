import * as React from 'react';
import { Fragment } from 'react';
import { Redirect } from 'react-router';
import LoadingBar from 'react-redux-loading-bar';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

import PageTitle from '../../02_atoms/PageTitle';

interface TaxonomyVocabularyElement {
  id: string;
  attributes: {
    name: string,
    description: string,
    vid: string,
  };
}

interface Props {
  requestTaxonomyVocabulary: () => any;
  taxonomyVocabulary?: TaxonomyVocabularyElement[];
}

interface State {
  activeLink: string;
  taxonomy: {
    taxonomyVocabulary: TaxonomyVocabularyElement[],
  };
}

export default class TaxonomyVocabulary extends React.Component<Props, State> {

  static defaultProps = {
    taxonomyVocabulary: [],
  };


  state = {
    activeLink: '',
    taxonomy: {
      taxonomyVocabulary:[],
    }
  };

  componentDidMount() {
    this.props.requestTaxonomyVocabulary();
  }

  vocabularyOperations = (vid: string) => (
    <FormControl>
      {/* @todo Extract the select element with links out into a component */}
      <Select
        value=""
        autoWidth={true}
        onChange={e => this.setState({ activeLink: e.target.value })}
      >
        <MenuItem value={`/admin/structure/taxonomy/manage/${vid}/overview`}>
          List Terms
        </MenuItem>
        <MenuItem value={`/admin/structure/taxonomy/manage/${vid}`}>
          Edit Vocabulary
        </MenuItem>
        <MenuItem value={`/admin/structure/taxonomy/manage/${vid}/add`}>
          Add Terms
        </MenuItem>
        <MenuItem
          value={`/admin/structure/taxonomy/manage/${vid}/overview/fields`}
        >
          Manage Fields
        </MenuItem>
        <MenuItem
          value={`/admin/structure/taxonomy/manage/${vid}/overview/form-display`}
        >
          Manage Form Display
        </MenuItem>
        <MenuItem
          value={`/admin/structure/taxonomy/manage/${vid}/overview/display`}
        >
          Manage Display
        </MenuItem>
      </Select>
      {this.state.activeLink && <Redirect to={this.state.activeLink} />}
    </FormControl>
  );

  render() {
    const { taxonomyVocabulary } = this.props;
    return (
      <Fragment>
        <PageTitle>Taxonomy</PageTitle>
        <LoadingBar style={{ position: 'relative', marginBottom: '5px' }} />
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vocabulary name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxonomyVocabulary &&
                taxonomyVocabulary.map(vocabulary => (
                  <TableRow key={vocabulary.id}>
                    <TableCell>{vocabulary.attributes.name}</TableCell>
                    <TableCell>{vocabulary.attributes.description}</TableCell>
                    <TableCell>
                      {this.vocabularyOperations(vocabulary.attributes.vid)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </Fragment>
    );
  }
}
