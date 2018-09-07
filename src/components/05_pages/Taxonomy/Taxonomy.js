import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class Taxonomy extends React.Component {
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
  componentDidMount() {
    this.props.requestTaxonomyVocabulary();
  }
  vocabularyOperations = vid => (
    <FormControl>
      <Select autoWidth>
        <Link to={`/admin/structure/taxonomy/manage/${vid}/overview`}>
          List Terms
        </Link>
        <Link to={`/admin/structure/taxonomy/manage/${vid}`}>
          Edit Vocabulary
        </Link>
        <Link to={`/admin/structure/taxonomy/manage/${vid}/add`}>
          Add Terms
        </Link>
        <Link to={`/admin/structure/taxonomy/manage/${vid}/overview/fields`}>
          Manage Fields
        </Link>
        <Link
          to={`/admin/structure/taxonomy/manage/${vid}/overview/form-display`}
        >
          Manage Form Display
        </Link>
        <Link to={`/admin/structure/taxonomy/manage/${vid}/overview/display`}>
          Manage Display
        </Link>
      </Select>
    </FormControl>
  );
  render() {
    const { taxonomyVocabulary } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>VOCABULARY NAME</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>OPERATIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taxonomyVocabulary &&
            taxonomyVocabulary.map(vocabulary => (
              <TableRow>
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
