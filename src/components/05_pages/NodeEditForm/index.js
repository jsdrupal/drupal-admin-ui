import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import NodeForm from '../NodeForm';
import { requestSingleContent } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

class NodeEditForm extends React.Component {
  componentDidMount() {
    this.props.requestSingleContent(this.props.bundle, this.props.id);
  }

  render() {
    if (this.props.entity) {
      return <Fragment>
        <PageTitle>Edit {this.props.bundle} {this.props.entity.data.attributes.title}</PageTitle>
      <NodeForm {...this.props} />
      </Fragment>
    }
    return null;
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
