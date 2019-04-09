import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { Redirect } from 'react-router';

import LoadingBar from 'react-redux-loading-bar';

import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

import PageTitle from '../../02_atoms/PageTitle';

const styles = {
  action: css`
    margin-left: 0rem;
    margin-bottom: 0.5rem;
    min-width: 5rem;
    max-width: 15rem;
  `,
};

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
    <FormControl className={styles.action}>
      {/* @todo Extract the select element with links out into a component */}
      <InputLabel htmlFor="action">Actions</InputLabel>
      <Select
        value={this.state.activeLink || ''}
        autoWidth
        onChange={e => this.setState({ activeLink: e.target.value })}
        data-nightwatch="taxonomy-operations"
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
