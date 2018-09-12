import { connect } from 'react-redux';

import TaxonomyVocabulary from './TaxonomyVocabulary';
import { requestTaxonomyVocabulary } from '../../../actions/taxonomy';

export default connect(
  state => ({ taxonomyVocabulary: state.taxonomy.taxonomyVocabulary }),
  { requestTaxonomyVocabulary },
)(TaxonomyVocabulary);
