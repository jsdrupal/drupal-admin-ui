import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
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
        {entity && <PageTitle>Edit {bundle} {entity.data.attributes.title}</PageTitle>}
        <LoadingBar />
        {entity && <NodeForm {...this.props} />}
      </Fragment>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      entity: state.content.contentById[props.id],
    };
  },
  {
    requestSingleContent,
  },
)(NodeEditForm);
