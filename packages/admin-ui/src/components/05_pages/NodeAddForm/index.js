import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NodeForm from '../NodeForm';
import {
  contentAddChange,
  contentAdd,
  requestUser,
} from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';
import { createEntity } from '../../../utils/api/schema';
import { requestSchema } from '../../../actions/schema';
import SchemaPropType from '../NodeForm/SchemaPropType';
import { cleanupRelationships } from '../../../utils/api/content';

class NodeAddForm extends React.Component {
  static propTypes = {
    bundle: PropTypes.string.isRequired,
    contentAdd: PropTypes.func.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    schema: PropTypes.oneOfType([SchemaPropType, PropTypes.bool]),
    requestSchema: PropTypes.func.isRequired,
    requestUser: PropTypes.func.isRequired,
    user: PropTypes.shape({}),
  };

  static defaultProps = {
    schema: false,
    user: false,
  };

  componentDidMount() {
    this.props.requestUser(1);
    this.props.requestSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
  }

  onSave = entity => {
    this.props.contentAdd(
      cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${this.props.bundle}`,
      }),
      this.props.bundle,
    );
  };

  forgeEntity = schema => {
    const entity = createEntity(schema);
    // Set default `Created On` attribute.
    const local = new Date();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    entity.attributes.created = Math.round(+local / 1000);

    // Set default `Authored By` relationship.
    entity.relationships.uid.data = { ...this.props.user };

    return entity;
  };

  render() {
    return (
      this.props.schema &&
      this.props.user && (
        <Fragment>
          <PageTitle>
            Create
            {this.props.bundle}
          </PageTitle>
          <LoadingBar />
          <NodeForm
            {...this.props}
            entity={this.forgeEntity(this.props.schema)}
            onSave={this.onSave}
          />
        </Fragment>
      )
    );
  }
}

const extractRestorableEntity = (state, bundle) =>
  state.content.restorableContentAddByBundle[bundle];

export default connect(
  (
    state,
    {
      match: {
        params: { bundle },
      },
    },
  ) => ({
    schema: state.schema.schema[`node--${bundle}`],
    restorableEntity: extractRestorableEntity(state, bundle),
    user: state.content.user,
    entityTypeId: 'node',
    bundle,
  }),
  {
    contentAdd,
    requestSchema,
    onChange: contentAddChange,
    requestUser,
  },
)(NodeAddForm);
