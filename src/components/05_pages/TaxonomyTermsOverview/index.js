import { connect } from 'react-redux';

import TaxonomyTermsOverview from './TaxonomyTermsOverview';
import {
  requestTaxonomyTerms,
  requestTaxonomyVocabulary,
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
  { requestTaxonomyTerms, requestTaxonomyVocabulary },
)(TaxonomyTermsOverview);
