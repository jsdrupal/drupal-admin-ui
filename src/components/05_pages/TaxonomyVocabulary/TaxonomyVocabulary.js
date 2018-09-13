import React from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

export default class TaxonomyVocabulary extends React.Component {
  static propTypes = {
    requestTaxonomyVocabulary: PropTypes.func.isRequired,
    taxonomyVocabulary: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(
        PropTypes.shape({
          attributes: PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string,
            vid: PropTypes.string,
          }),
        }),
      ),
    ]),
  };
  static defaultProps = {
    taxonomyVocabulary: null,
  };
  state = {
    activeLink: null,
  };

  componentDidMount() {
    this.props.requestTaxonomyVocabulary();
  }

  vocabularyOperations = vid => (
    <FormControl>
      {/* @todo Extract the select element with links out into a component */}
      <Select
        value=""
        autoWidth
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
    );
  }
}
