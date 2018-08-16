import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import SchemaPropType from './SchemaPropType';

import { contentAdd } from '../../../actions/content';
import { requestSchema, requestUiSchema } from '../../../actions/schema';

import {
  createEntity,
  createUISchema,
  sortUISchemaFields,
} from '../../../utils/api/schema';

let styles;

class NodeForm extends React.Component {
  static propTypes = {
    schema: PropTypes.oneOfType([SchemaPropType, PropTypes.bool]),
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
      ]).isRequired,
    ).isRequired,
    contentAdd: PropTypes.func.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    requestSchema: PropTypes.func.isRequired,
    requestUiSchema: PropTypes.func.isRequired,
    uiSchema: PropTypes.oneOfType([
      PropTypes.shape({
        fieldSchema: PropTypes.shape({}),
        formDisplaySchema: PropTypes.shape({}),
      }),
      PropTypes.bool,
    ]),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    schema: false,
    uiSchema: false,
    onChange: () => {},
  };

  state = {
    restorableEntity: null,
  };

  static getDerivedStateFromProps(props, prevState) {
    if (!props.schema) {
      return prevState;
    }

    if (!props.uiSchema) {
      return prevState;
    }

    if (Object.prototype.hasOwnProperty.call(prevState || {}, 'entity')) {
      return prevState;
    }

    const state = {
      ...prevState,
      restorableEntity: props.restorableEntity,
      entity: props.entity || {
        ...createEntity(props.schema),
      },
    };
    // Just contain values which are in the ui metadata.
    state.entity.data.attributes = Object.entries(state.entity.data.attributes)
      .filter(([key]) =>
        Object.keys(props.uiSchema.formDisplaySchema)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});
    return state;
  }

  componentDidMount() {
    this.props.requestSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
    this.props.requestUiSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
  }

  onAttributeChange = fieldName => data => {
    this.setState(
      prevState => ({
        entity: {
          data: {
            ...prevState.entity.data,
            attributes: {
              ...prevState.entity.data.attributes,
              [fieldName]: data,
            },
          },
        },
      }),
      () => {debugger; return this.props.onChange(this.state.entity);},
    );
  };

  onRelationshipChange = fieldName => data => {
    // Support widgets with multiple cardinality.
    let fieldData;
    if (typeof data.data !== 'undefined') {
      fieldData = data.data;
    } else {
      fieldData = Object.values(data);
    }
    this.setState(
      prevState => ({
        entity: {
          data: {
            ...prevState.entity.data,
            relationships: {
              ...prevState.entity.data.relationships,
              [fieldName]: {
                data: fieldData,
              },
            },
          },
        },
      }),
      () => this.props.onChange(this.state.entity),
    );
  };

  onSave = () => {
    // @todo Remove in https://github.com/jsdrupal/drupal-admin-ui/issues/245
    const { data: entity } = this.state.entity;

    const data = {
      ...entity,
      type: `${this.props.entityTypeId}--${this.props.bundle}`,
    };
    this.props.contentAdd(data);
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  createField = ({ fieldName, widget, inputProps }) => {
    // @todo We need to pass along props.
    // @todo How do we handle cardinality together with jsonapi
    // making a distinction between single value fields and multi value fields.
    const fieldSchema = this.getSchemaInfo(this.props.schema, fieldName);

    const {
      attributes,
      relationships,
    } = this.props.schema.properties.data.properties;

    const propType =
      (attributes.properties[fieldName] && 'attributes') ||
      (relationships.properties[fieldName] && 'relationships');

    return React.createElement(widget, {
      key: fieldName,
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
      fieldName,
      classes: {
        root: styles.widgetRoot,
      },
      value: this.state.entity.data[propType][fieldName],
      label: fieldSchema && fieldSchema.title,
      schema: fieldSchema,
      onChange: (propType === 'attributes'
        ? this.onAttributeChange
        : this.onRelationshipChange)(fieldName),
      required: this.props.schema.properties.data.properties.attributes.required.includes(
        fieldName,
      ),
      inputProps,
    });
  };

  renderRestoreSnackbar() {
    return (
      this.state.restorableEntity && (
        <Snackbar
          open={Boolean(this.state.restorableEntity)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Unsaved content found</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.setState({
                entity: this.state.restorableEntity,
              })}
            >
              Restore
            </Button>,
          ]}
        />
      )
    );
  }

  render() {
    let result = null;
    if (this.props.schema && this.props.uiSchema && this.state.entity) {
      const { right, left } = sortUISchemaFields(
        createUISchema(
          this.props.uiSchema.fieldSchema,
          this.props.uiSchema.formDisplaySchema,
          this.props.widgets,
        ),
        ['promote', 'status', 'sticky'],
      );
      result = (
        <div className={styles.gridRoot}>
          {this.renderRestoreSnackbar()}
          <Paper classes={{ root: styles.fieldContainer }}>
            {left.map(this.createField)}
            <Divider classes={{ root: styles.divider }} />
            <Button variant="contained" color="primary" onClick={this.onSave}>
              Save
            </Button>
          </Paper>
          <Paper classes={{ root: styles.fieldContainer }}>
            {right.map(this.createField)}
          </Paper>
        </div>
      );
    }
    return result;
  }
}

styles = {
  fieldContainer: css`
    padding: 50px 90px 40px;
  `,
  divider: css`
    margin: 40px 0;
  `,
  gridRoot: css`
    display: grid;
    width: 100%;
    grid-gap: 20px;
    grid-template-columns: 75% 25%;
    padding-right: 50px;
  `,
  widgetRoot: css`
    display: flex;
    align-items: start;
  `,
};

const extractRestorableEntity = (state, bundle) => {
  return state.content.contentAddByBundle[bundle];
};

const mapStateToProps = (state, { bundle, entityTypeId }) => ({
  schema: state.schema.schema[`${entityTypeId}--${bundle}`],
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
  restorableEntity: extractRestorableEntity(state, bundle),
});

export default connect(
  mapStateToProps,
  {
    requestSchema,
    requestUiSchema,
    contentAdd,
  },
)(NodeForm);
