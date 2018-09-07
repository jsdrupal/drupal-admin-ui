import { connect } from 'react-redux';

import Taxonomy from './Taxonomy';
import { requestTaxonomyVocabulary } from '../../../actions/taxonomy';

export default connect(
  state => ({ taxonomyVocabulary: state.taxonomy.taxonomyVocabulary }),
  { requestTaxonomyVocabulary },
)(Taxonomy);
