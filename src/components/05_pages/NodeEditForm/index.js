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

let styles;

class NodeEditForm extends React.Component {
  componentDidMount() {
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
    const { entity } = this.props;
    let result = null;
    if (entity) {
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
              entity={{ data: entity }}
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
};

NodeEditForm.propTypes = {
  nid: PropTypes.string.isRequired,
  requestSingleContent: PropTypes.func.isRequired,
  contentSave: PropTypes.func.isRequired,
  entityTypeId: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    attributes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }),
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
  (state, props) => {
    const entity = state.content.contentByNid[props.nid];
    return {
      entity: state.content.contentByNid[props.nid],
      restorableEntity: entity && extractRestorableEntity(state, entity),
    };
  },
  {
    requestSingleContent,
    contentSave,
    onChange: contentEditChange,
  },
)(NodeEditForm);
