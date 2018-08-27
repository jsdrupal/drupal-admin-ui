import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import { contentAddChange, contentAdd } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';
import { createEntity } from '../../../utils/api/schema';
import { requestSchema } from '../../../actions/schema';
import SchemaPropType from '../NodeForm/SchemaPropType';

class NodeAddForm extends React.Component {
  static propTypes = {
    bundle: PropTypes.string.isRequired,
    contentAdd: PropTypes.func.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    schema: PropTypes.oneOfType([SchemaPropType, PropTypes.bool]),
    requestSchema: PropTypes.func.isRequired,
  };

  static defaultProps = {
    schema: false,
  };

  componentDidMount() {
    this.props.requestSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
  }

  onSave = entity => {
    const data = {
      ...entity,
      type: `${this.props.entityTypeId}--${this.props.bundle}`,
    };
    this.props.contentAdd(data, this.props.bundle);
  };

  render() {
    return (
      this.props.schema && (
        <Fragment>
          <PageTitle>Create {this.props.bundle}</PageTitle>
          <LoadingBar />
          <NodeForm
            {...this.props}
            entity={createEntity(this.props.schema)}
            onSave={this.onSave}
          />
        </Fragment>
      )
    );
  }
}

const extractRestorableEntity = (state, bundle) =>
  state.content.contentAddByBundle[bundle];

export default connect(
  (state, { bundle, entityTypeId }) => ({
    schema: state.schema.schema[`${entityTypeId}--${bundle}`],
    restorableEntity: extractRestorableEntity(state, bundle),
  }),
  {
    contentAdd,
    requestSchema,
    onChange: contentAddChange,
  },
)(NodeAddForm);
