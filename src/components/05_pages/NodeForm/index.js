import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import SchemaPropType from './SchemaPropType';

import { contentAdd, requestUser } from '../../../actions/content';
import { requestSchema, requestUiSchema } from '../../../actions/schema';

import { setMessage } from '../../../actions/application';
import { MESSAGE_SEVERITY_ERROR } from '../../../constants/messages';

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
    onSave: PropTypes.func.isRequired,
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
    requestUser: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    schema: false,
    uiSchema: false,
  };

  state = {};

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

    // @TODO Remove this when we create the entity scaffolding at the NodeEdit
    // or NodeAdd component level.
    // https://github.com/jsdrupal/drupal-admin-ui/issues/378
    // Set default `Authored By` relationship.
    if (!Object.prototype.hasOwnProperty.call(props, 'entity')) {
      state.entity.data.relationships.uid.data = { ...props.user };
    }
    return state;
  }

  componentDidMount() {
    this.props.requestUser(1);
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
    this.setState(prevState => ({
      entity: {
        data: {
          ...prevState.entity.data,
          attributes: {
            ...prevState.entity.data.attributes,
            [fieldName]: data,
          },
        },
      },
    }));
  };

  onSave = () => {
    const missingFields = this.resolveRequiredFiles();
    if (missingFields.length) {
      this.props.setMessage(
        `${missingFields.join(' ')} are missing.`,
        MESSAGE_SEVERITY_ERROR,
      );
    } else {
      this.props.onSave(this.state.entity.data);
    }
  };

  onRelationshipChange = fieldName => data => {
    // Support widgets with multiple cardinality.
    let fieldData;
    if (typeof data.data !== 'undefined') {
      fieldData = data.data;
    } else {
      fieldData = Object.values(data);
    }
    this.setState(prevState => ({
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
    }));
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  resolveRequiredFiles = () => {
    const unavailableFields = ['nid', 'uuid', 'vid', 'path'];
    const requiredFields = this.props.schema.properties.data.properties.attributes.required.filter(
      field => !unavailableFields.includes(field),
    );
    return Object.entries(this.state.entity.data.attributes)
      .filter(([fieldName]) => requiredFields.includes(fieldName))
      .filter(([fieldName, value]) => {
        if (
          typeof value === 'object' &&
          Object.keys(value).length &&
          value.value === ''
        ) {
          return fieldName;
        }
        if (typeof value === 'string' && value.length === 0) {
          return fieldName;
        }
        return false;
      })
      .map(([fieldName]) => fieldName);
  };

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

  render() {
    let result = null;
    if (this.props.schema && this.props.uiSchema) {
      const { right, left } = sortUISchemaFields(
        createUISchema(
          this.props.uiSchema.fieldSchema,
          this.props.uiSchema.formDisplaySchema,
          this.props.uiSchema.fieldStorageConfig,
          this.props.widgets,
        ),
        ['promote', 'status', 'sticky', 'uid', 'created'],
      );
      result = (
        <div className={styles.gridRoot}>
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

const mapStateToProps = (state, { bundle, entityTypeId }) => ({
  schema: state.schema.schema[`${entityTypeId}--${bundle}`],
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
  user: state.content.user,
});

export default connect(
  mapStateToProps,
  {
    requestSchema,
    requestUiSchema,
    contentAdd,
    requestUser,
    setMessage,
  },
)(NodeForm);
