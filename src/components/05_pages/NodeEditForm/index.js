import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import NodeForm from '../NodeForm';
import { requestSingleContent } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

class NodeEditForm extends React.Component {
  componentDidMount() {
    this.props.requestSingleContent(this.props.bundle, this.props.id);
  }

  render() {
    const { entity, bundle } = this.props;
    return (
      <Fragment>
        {entity && (
          <PageTitle>
            Edit {bundle} {entity.data.attributes.title}
          </PageTitle>
        )}
        <LoadingBar />
        {entity && <NodeForm {...this.props} />}
      </Fragment>
    );
  }
}

NodeEditForm.defaultProps = {
  entity: null,
};

NodeEditForm.propTypes = {
  bundle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  requestSingleContent: PropTypes.func.isRequired,
  entity: PropTypes.shape({
    data: PropTypes.shape({
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
};

export default connect(
  (state, props) => ({
    entity: state.content.contentById[props.id],
  }),
  {
    requestSingleContent,
  },
)(NodeEditForm);
