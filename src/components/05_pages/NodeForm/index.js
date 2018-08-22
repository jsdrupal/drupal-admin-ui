import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import SchemaPropType from './SchemaPropType';

import { contentAdd, requestUser } from '../../../actions/content';
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
    restorableEntity: PropTypes.shape({
      data: PropTypes.array,
    }),
    requestUser: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    schema: false,
    uiSchema: false,
    restorableEntity: null,
    onChange: () => {},
  };

  state = {
    restored: false,
  };

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

    this.calculateState(this.props, this.state, state => this.setState(state));
  }

  componentDidUpdate() {
    this.calculateState(this.props, this.state, state => this.setState(state));
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
      () => this.props.onChange(this.props.bundle, this.state.entity),
    );
  };

  onSave = () => {
    this.props.onSave(this.state.entity.data);
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
      () => this.props.onChange(this.props.bundle, this.state.entity),
    );
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  calculateState = (prevProps, prevState, setState) => {
    if (!prevProps.schema) {
      return;
    }

    if (!prevProps.uiSchema) {
      return;
    }

    if (prevState.entity) {
      return;
    }

    const state = {
      ...prevState,
      // Mark the entity as restored when we don't have a restoreable entity,
      // as we don't want to ask the user.
      restored: prevState.restored || !prevProps.restorableEntity,
      restorableEntity: !prevState.restored && prevProps.restorableEntity,
      entity: prevProps.entity || {
        ...createEntity(prevProps.schema),
      },
    };

    // Just contain values which are in the ui metadata.
    state.entity.data.attributes = Object.entries(state.entity.data.attributes)
      .filter(([key]) =>
        Object.keys(prevProps.uiSchema.formDisplaySchema)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});

    // @TODO Remove this when we create the entity scaffolding at the NodeEdit
    // or NodeAdd component level.
    // https://github.com/jsdrupal/drupal-admin-ui/issues/378
    // Set default `Authored By` relationship.
    if (!Object.prototype.hasOwnProperty.call(prevProps, 'entity')) {
      state.entity.data.relationships.uid.data = { ...prevProps.user };
    }

    setState(state);
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

  renderRestoreSnackbar() {
    return (
      // Ensure that there was some previously stored entity
      this.props.restorableEntity &&
      // Hide thie restore form once the content got restored.
      !this.state.restored && (
        <Snackbar
          open
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Unsaved content found</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={() =>
                this.setState({
                  entity: this.props.restorableEntity,
                  restored: true,
                })
              }
            >
              Restore
            </Button>,
            <Button
              key="hide"
              color="primary"
              size="small"
              onClick={() =>
                this.setState({
                  restored: true,
                })
              }
            >
              Hide
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
          this.props.uiSchema.fieldStorageConfig,
          this.props.widgets,
        ),
        ['promote', 'status', 'sticky', 'uid', 'created'],
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
  },
)(NodeForm);
