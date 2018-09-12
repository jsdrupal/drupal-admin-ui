import { connect } from 'react-redux';

import TaxonomyTermsOverview from './TaxonomyTermsOverview';
import {
  requestTaxonomyTerms,
  requestTaxonomyVocabularyById,
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
    taxonomyVocabulary: state.taxonomy.taxonomyVocabulary[0],
    vocabulary,
  }),
  { requestTaxonomyTerms, requestTaxonomyVocabularyById },
)(TaxonomyTermsOverview);
