import { connect } from 'react-redux';

import TaxonomyTermsOverview from './TaxonomyTermsOverview';
import {
  requestTaxonomyTerms,
  getTaxonomyVocabularyById,
} from '../../../actions/taxonomy';

export default connect(
  (
    state,
    {
      match: {
        params: { vocabulary },
      },
    },
  ) => ({
    taxonomyTerms: state.taxonomy.taxonomyTerms[vocabulary],
    taxonomyVocabulary: getTaxonomyVocabularyById(
      state.taxonomy.taxonomyVocabulary,
      vocabulary,
    ),
    vocabulary,
  }),
  { requestTaxonomyTerms },
)(TaxonomyTermsOverview);
