import { connect } from 'react-redux';

import { requestContentTypes } from '../../../actions/application';

import AddContent from './AddContent';

const mapStateToProps = state => ({
  contentTypes: state.application.contentTypes,
});

export default connect(
  mapStateToProps,
  { requestContentTypes },
)(AddContent);
