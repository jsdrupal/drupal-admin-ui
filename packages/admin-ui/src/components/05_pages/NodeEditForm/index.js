import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
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
import SchemaPropType from '../NodeForm/SchemaPropType';

let styles;

class NodeEditForm extends React.Component {
  componentDidMount() {
    this.props.requestSchemaByEntityId({
      entityTypeId: this.props.entityTypeId,
      entityId: this.props.nid,
    });
    this.props.requestSingleContent(this.props.nid);
  }

  onSave = bundle => entity => {
    this.props.contentSave(
      cleanupRelationships({
        ...entity,
        type: `${this.props.entityTypeId}--${bundle}`,
      }),
    );
  };

  render() {
    const { entity, schema } = this.props;
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
            <NodeForm
              {...this.props}
              bundle={bundle}
              entity={entity}
              onSave={this.onSave(bundle)}
            />
          )}
        </Fragment>
      );
    }
    return result;
  }
}

NodeEditForm.defaultProps = {
  entity: null,
  schema: null,
};

NodeEditForm.propTypes = {
  nid: PropTypes.string.isRequired,
  requestSingleContent: PropTypes.func.isRequired,
  contentSave: PropTypes.func.isRequired,
  entityTypeId: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }),
  requestSchemaByEntityId: PropTypes.func.isRequired,
  schema: PropTypes.oneOfType([SchemaPropType, PropTypes.bool]),
};

styles = {
  bundle: css`
    text-transform: capitalize;
  `,
};

const extractRestorableEntity = (state, entity) => {
  const restorableEntity = state.content.restorableContentEditById[entity.id];
  if (
    restorableEntity &&
    restorableEntity.attributes &&
    entity &&
    entity.attributes &&
    // Restoring content is only offered when the loaded entity wasn't changed in the meantime.
    restorableEntity.attributes.changed === entity.attributes.change
  ) {
    return restorableEntity;
  }
  return null;
};

export default connect(
  (
    state,
    {
      match: {
        params: { nid },
      },
    },
  ) => {
    const entity = state.content.contentByNid[nid];
    return {
      schema: state.schema.schema[`node--${nid}`],
      entity,
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
