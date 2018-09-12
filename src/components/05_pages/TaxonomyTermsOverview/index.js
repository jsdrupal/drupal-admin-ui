import { connect } from 'react-redux';

import TaxonomyTermsOverview from './TaxonomyTermsOverview';
import {
  requestTaxonomyTerms,
  filterTaxonomyVocabulary,
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
    taxonomyVocabulary: filterTaxonomyVocabulary(
      state.taxonomy.taxonomyVocabulary,
      vocabulary,
    )[0],
    vocabulary,
  }),
  { requestTaxonomyTerms },
)(TaxonomyTermsOverview);
