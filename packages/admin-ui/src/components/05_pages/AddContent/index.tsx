import { connect } from 'react-redux';

import { requestContentTypes } from '../../../actions/application';

import AddContent from './AddContent';

// TODO must lock down.
// @ts-ignore
const mapStateToProps = (state: any) => ({
  contentTypes: state.application.contentTypes,
});

export default connect(
  mapStateToProps,
  { requestContentTypes },
)(AddContent);
