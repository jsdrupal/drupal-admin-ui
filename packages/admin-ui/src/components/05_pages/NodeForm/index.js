import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import SchemaPropType from './SchemaPropType';

import MultipleFields from '../../02_atoms/MultipleFields/MultipleFields';

import { contentAdd } from '../../../actions/content';
import { requestUiSchema } from '../../../actions/schema';
import {
  requestComponentList,
  setErrorMessage,
} from '../../../actions/application';

import { createUISchema, sortUISchemaFields } from '../../../utils/api/schema';
import EnsureComponent from '../../02_atoms/EnsureComponent/EnsureComponent';

let styles;

class NodeForm extends React.Component {
  static propTypes = {
    schema: PropTypes.oneOfType([SchemaPropType, PropTypes.bool]),
    onSave: PropTypes.func.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    requestUiSchema: PropTypes.func.isRequired,
    uiSchema: PropTypes.oneOfType([
      PropTypes.shape({
        fieldSchema: PropTypes.shape({}),
        formDisplaySchema: PropTypes.shape({}),
      }),
      PropTypes.bool,
    ]),
    restorableEntity: PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }),
    setErrorMessage: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    requestComponentList: PropTypes.func.isRequired,
    components: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
  };

  static defaultProps = {
    schema: false,
    uiSchema: false,
    restorableEntity: null,
    onChange: () => {},
    components: null,
  };

  state = {
    restored: false,
  };

  componentDidMount() {
    this.props.requestUiSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });

    this.calculateState(this.props, this.state, state => this.setState(state));
    this.props.requestComponentList();
  }

  componentDidUpdate() {
    this.calculateState(this.props, this.state, state => this.setState(state));
  }

  onAttributeChange = fieldName => data => {
    this.setState(
      prevState => ({
        entity: {
          ...prevState.entity,
          attributes: {
            ...prevState.entity.attributes,
            [fieldName]: data,
          },
        },
      }),
      () => this.props.onChange(this.props.bundle, this.state.entity),
    );
  };

  onSave = () => {
    const missingFields = this.resolveMissingRequiredFields();
    if (missingFields.length) {
      this.props.setErrorMessage(
        missingFields.length > 1
          ? `The following fields are missing, ${missingFields.join(', ')}.`
          : `The following field is missing, ${missingFields.join('')}.`,
      );
    } else {
      this.props.onSave(this.state.entity);
    }
  };

  onRelationshipChange = fieldName => data => {
    // Support widgets with multiple cardinality.
    const fieldData = Object.values(data);
    this.setState(
      prevState => ({
        entity: {
          ...prevState.entity,
          relationships: {
            ...prevState.entity.relationships,
            [fieldName]: fieldData,
          },
        },
      }),
      () => this.props.onChange(this.props.bundle, this.state.entity),
    );
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.attributes.properties[fieldName] ||
    schema.properties.relationships.properties[fieldName];

  resolveMissingRequiredFields = () => {
    const unavailableFields = ['nid', 'uuid', 'vid', 'path'];
    const requiredFields = this.props.schema.properties.attributes.required.filter(
      field => !unavailableFields.includes(field),
    );
    return Object.entries(this.state.entity.attributes)
      .filter(([fieldName]) => requiredFields.includes(fieldName))
      .filter(([fieldName, value]) => {
        // @todo Ideally the schema would identify the main property for us.
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
      entity: prevProps.entity,
    };

    // Just contain values which are in the ui metadata.
    state.entity.attributes = Object.entries(state.entity.attributes)
      .filter(([key]) =>
        Object.keys(prevProps.uiSchema.formDisplaySchema)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});

    setState(state);
  };

  createField = ({ fieldName, widget, inputProps }) => {
    // @todo We need to pass along props.
    // @todo How do we handle cardinality together with jsonapi
    // making a distinction between single value fields and multi value fields.
    const fieldSchema = this.getSchemaInfo(this.props.schema, fieldName);

    const { attributes, relationships } = this.props.schema.properties;

    const propType =
      (attributes.properties[fieldName] && 'attributes') ||
      (relationships.properties[fieldName] && 'relationships');

    const widgetProps = {
      key: fieldName,
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
      fieldName,
      classes: {
        root: styles.widgetRoot,
      },
      value: this.state.entity[propType][fieldName],
      label: fieldSchema && fieldSchema.title,
      schema: fieldSchema,
      onChange: (propType === 'attributes'
        ? this.onAttributeChange
        : this.onRelationshipChange)(fieldName),
      required: this.props.schema.properties.attributes.required.includes(
        fieldName,
      ),
      inputProps,
    };

    const widgetIsMultiple = widget.multiple || false;
    const hasMultipleDeltas =
      (fieldSchema.type && fieldSchema.type === 'array') ||
      (fieldSchema.properties && fieldSchema.properties.type === 'array');

    return (
      <EnsureComponent
        name={widget.name}
        component={widget.component}
        render={widgetComponent =>
          hasMultipleDeltas && !widgetIsMultiple ? (
            <MultipleFields component={widgetComponent} {...widgetProps} />
          ) : (
            React.createElement(widgetComponent, widgetProps)
          )
        }
      />
    );
  };

  renderRestoreSnackbar() {
    return (
      // Ensure that there was some previously stored entity
      this.props.restorableEntity &&
      // Hide thie restore form once the content got restored.
      !this.state.restored && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={10000}
          open
          data-nightwatch="restore-content-snackbar"
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
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() =>
                this.setState({
                  restored: true,
                })
              }
            >
              <CloseIcon className={styles.icon} />
            </IconButton>,
          ]}
        />
      )
    );
  }

  render() {
    let result = null;
    if (
      this.props.schema &&
      this.props.uiSchema &&
      this.state.entity &&
      this.props.components.widgets
    ) {
      const { right, left } = sortUISchemaFields(
        createUISchema(
          this.props.uiSchema.fieldSchema,
          this.props.uiSchema.formDisplaySchema,
          this.props.uiSchema.fieldStorageConfig,
          this.props.components.widgets,
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
  icon: css`
    font-size: 20px;
  `,
};

const mapStateToProps = (state, { bundle, entityTypeId }) => ({
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
  components: state.application.components,
});

export default connect(
  mapStateToProps,
  {
    requestUiSchema,
    contentAdd,
    setErrorMessage,
    requestComponentList,
  },
)(NodeForm);
