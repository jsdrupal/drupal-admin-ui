import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

import { Redirect } from 'react-router';

import LoadingBar from 'react-redux-loading-bar';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

import { PageTitle } from 'drupal-ui';

const styles = {
  addButton: css`
    margin: 0.5rem;
    position: fixed;
    right: 0;
    bottom: 0;
  `,
};

export default class TaxonomyTermsOverview extends React.Component {
  static propTypes = {
    requestTaxonomyTerms: PropTypes.func.isRequired,
    vocabulary: PropTypes.string.isRequired,
    taxonomyTerms: PropTypes.oneOfType([
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
    taxonomyVocabulary: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        attributes: PropTypes.shape({
          name: PropTypes.string,
          description: PropTypes.string,
          vid: PropTypes.string,
        }),
      }),
    ]),
  };
  static defaultProps = {
    taxonomyTerms: null,
    taxonomyVocabulary: null,
  };
  state = {
    activeLink: null,
  };
  componentDidMount() {
    this.props.requestTaxonomyTerms(this.props.vocabulary);
  }
  termOperations = tid => (
    <FormControl>
      {/* @todo Extract the select element with links out into a component */}
      <Select
        autoWidth
        onChange={e => this.setState({ activeLink: e.target.value })}
        value={this.state.activeLink}
      >
        <MenuItem value={`/taxonomy/term/${tid}/edit`}>Edit</MenuItem>
        <MenuItem value={`/taxonomy/term/${tid}/delete`}>Delete</MenuItem>
      </Select>
      {this.state.activeLink && <Redirect to={this.state.activeLink} />}
    </FormControl>
  );
  render() {
    const { taxonomyTerms, taxonomyVocabulary } = this.props;
    return (
      <Fragment>
        {taxonomyVocabulary && (
          <PageTitle>{taxonomyVocabulary.attributes.name}</PageTitle>
        )}
        <LoadingBar style={{ position: 'relative', marginBottom: '5px' }} />
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxonomyTerms &&
                taxonomyTerms.map(term => (
                  <TableRow key={term.attributes.uuid}>
                    <TableCell>{term.attributes.name}</TableCell>
                    <TableCell>
                      {this.termOperations(term.attributes.tid)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={styles.addButton}
          component={Link}
          to={`/admin/structure/taxonomy/manage/${this.props.vocabulary}/add`}
        >
          <AddIcon />
        </Button>
      </Fragment>
    );
  }
}
