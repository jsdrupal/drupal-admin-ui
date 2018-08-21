import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import NodeForm from '../NodeForm';
import { contentAdd, requestSingleContent } from '../../../actions/content';
import PageTitle from '../../02_atoms/PageTitle/PageTitle';

let styles;

class NodeEditForm extends React.Component {
  componentDidMount() {
    this.props.requestSingleContent(this.props.nid);
  }

  onSave(entity) {
    const data = {
      ...entity,
      type: `${this.props.entityTypeId}--${this.props.bundle}`,
    };
    // @todo this should be changed to edit specific action.
    this.props.contentAdd(data);
  }

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
              onSave={this.onSave}
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
  contentAdd: PropTypes.func.isRequired,
  entityTypeId: PropTypes.string.isRequired,
  bundle: PropTypes.string.isRequired,
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

export default connect(
  (state, props) => ({
    entity: state.content.contentByNid[props.nid],
  }),
  {
    requestSingleContent,
    contentAdd,
  },
)(NodeEditForm);
