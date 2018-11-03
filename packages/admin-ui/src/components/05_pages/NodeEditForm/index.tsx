import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { css } from 'emotion';
import NodeForm from '../NodeForm';
import {
  contentEditChange,
  contentSave,
  requestSingleContent,
} from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';
import { cleanupRelationships } from '../../../utils/api/content';
import { requestSchemaByEntityId } from '../../../actions/schema';
import SchemaProp from '../NodeForm/SchemaProp';

let styles : {
  bundle: string,
};

interface Props {
  nid: string;
  requestSingleContent: (nid: string) => any;
  contentSave: () => any;
  entityTypeId: string;
  entity: {
    attributes: {
      title: string,
    },
    type: string,
  };
  requestSchemaByEntityId: ({entityTypeId, entityId}:{entityTypeId: string, entityId: string}) => any;
  schema: SchemaProp | boolean;
}

class NodeEditForm extends React.Component<Props> {
  componentDidMount() {
    this.props.requestSchemaByEntityId({
      entityTypeId: this.props.entityTypeId,
      entityId: this.props.nid,
    });
    this.props.requestSingleContent(this.props.nid);
  }

  onSave = (bundle: string) => (entity: any) => {
    // @ts-ignore
    this.props.contentSave(
      cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${bundle}`,
      }),
    );
  };

  render() {
    const { entity, schema } : Props = this.props;
    let result = null;
    if (entity && schema) {
      const bundle = entity.type.replace('node--', '');
      result = (
        <Fragment>
          {entity && (
            <PageTitle>
              <em>
                Edit <span className={styles.bundle}>{bundle}</span>
              </em>{' '}
              {entity.attributes.title}
            </PageTitle>
          )}
          <LoadingBar />
          {entity && (
            // @ts-ignore
            <NodeForm
              {...this.props}
              bundle={bundle}
              entity={{ data: entity }}
              // @ts-ignore
              onSave={this.onSave(bundle)}
            />
          )}
        </Fragment>
      );
    }
    return result;
  }
}

styles = {
  bundle: css`
    text-transform: capitalize;
  `,
};

const extractRestorableEntity = (state: any, entity: any) => {
  const restorableEntity = state.content.restorableContentEditById[entity.id];
  if (
    restorableEntity &&
    restorableEntity.data &&
    restorableEntity.data.attributes &&
    entity &&
    entity.attributes &&
    // Restoring content is only offered when the loaded entity wasn't changed in the meantime.
    restorableEntity.data.attributes.changed === entity.attributes.change
  ) {
    return restorableEntity;
  }
  return null;
};

export default connect(
  (
    state,
    {
      // @ts-ignore
      match: {
        params: { nid },
      },
    },
  ) => {

    // @ts-ignore
    const entity = state.content.contentByNid[nid];
    return {
      // @ts-ignore
      schema: state.schema.schema[`node--${nid}`],
      // @ts-ignore
      entity: state.content.contentByNid[nid],
      restorableEntity: entity && extractRestorableEntity(state, entity),
      entityTypeId: 'node',
      nid,
    };
  },
  {
    requestSingleContent,
    contentSave,
    onChange: contentEditChange,
    requestSchemaByEntityId,
  },
)(NodeEditForm);
