import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import NodeForm from '../NodeForm';
import { requestSingleContent } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

class NodeEditForm extends React.Component {
  componentDidMount() {
    this.props.requestSingleContent(this.props.nid);
  }

  render() {
    const { entity } = this.props;
    return (
      <Fragment>
        {entity && (
          <PageTitle>
            Edit {entity.type.replace('node--', '')} {entity.attributes.title}
          </PageTitle>
        )}
        <LoadingBar />
        {entity && (
          <NodeForm
            {...this.props}
            bundle={entity.type.replace('node--', '')}
            entity={{ data: entity }}
          />
        )}
      </Fragment>
    );
  }
}

NodeEditForm.defaultProps = {
  entity: null,
};

NodeEditForm.propTypes = {
  nid: PropTypes.string.isRequired,
  requestSingleContent: PropTypes.func.isRequired,
  entity: PropTypes.shape({
    attributes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default connect(
  (state, props) => ({
    entity: state.content.contentByNid[props.nid],
  }),
  {
    requestSingleContent,
  },
)(NodeEditForm);
