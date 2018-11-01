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
      // @ts-ignore
      match: {
        params: { vocabulary },
      },
    },
  ) => ({
    // @ts-ignore
    taxonomyTerms: state.taxonomy.taxonomyTerms[vocabulary],
    taxonomyVocabulary: getTaxonomyVocabularyById(
      // @ts-ignore
      state.taxonomy.taxonomyVocabulary,
      vocabulary,
    ),
    vocabulary,
  }),
  { requestTaxonomyTerms },
// @ts-ignore  
)(TaxonomyTermsOverview);
