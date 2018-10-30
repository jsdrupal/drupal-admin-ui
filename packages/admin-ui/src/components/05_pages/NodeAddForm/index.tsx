import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
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
import SchemaProp from '../NodeForm/SchemaProp';
import { cleanupRelationships } from '../../../utils/api/content';

interface Props {
  bundle: string,
  contentAdd: ({ payload: { content } }: any) => any,
  entityTypeId: string,
  schema?: SchemaProp | boolean,
  requestSchema: ({ entityTypeId, bundle }: {entityTypeId:string, bundle:string}) => any,
  requestUser: (uid: string) => any,
  user?: object,
};

interface State {
  content: {user: any},
  entityTypeId: string,
  user: any,
};

class NodeAddForm extends React.Component<Props, State> {

  static defaultProps = {
    schema: false,
    user: false,
  };

  componentDidMount() {
    this.props.requestUser('1');
    this.props.requestSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
  }

  onSave = (entity: any) => {
    // This looks like a bug the function takes only one parameter
    // @ts-ignore
    this.props.contentAdd(
      cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${this.props.bundle}`,
      }),
      this.props.bundle,
    );
  };

  // @ts-ignore
  forgeEntity = (schema) => {
    const entity = createEntity(schema);
    // Set default `Created On` attribute.
    const local = new Date();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    entity.data.attributes.created = Math.round(+local / 1000);

    // Set default `Authored By` relationship.
    entity.data.relationships.uid.data = { ...this.props.user };

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
          // @ts-ignore
          <NodeForm
            {...this.props}
            entity={this.forgeEntity(this.props.schema)}
            // @ts-ignore
            onSave={this.onSave}
          />
        </Fragment>
      )
    );
  }
}

// TODO must return an define state interface.
// @ts-ignore
const extractRestorableEntity = (state, bundle: string) =>
  state.content.restorableContentAddByBundle[bundle];

export default connect(
  (
    state,
    {
      // @ts-ignore
      match: {
        params: { bundle },
      },
    },
  ) => ({
    // @ts-ignore
    schema: state.schema.schema[`node--${bundle}`],
    // @ts-ignore
    restorableEntity: extractRestorableEntity(state, bundle),
    // @ts-ignore
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
  // @ts-ignore
)(NodeAddForm);
