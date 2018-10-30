import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import SchemaProp from './SchemaProp';

import MultipleFields from '../../02_atoms/MultipleFields/MultipleFields';

import { contentAdd } from '../../../actions/content';
import { requestUiSchema } from '../../../actions/schema';
import { setErrorMessage } from '../../../actions/application';

import { createUISchema, sortUISchemaFields } from '../../../utils/api/schema';

import widgets from './Widgets';

let styles: {
  fieldContainer: string,
  divider: string,
  gridRoot: string,
  widgetRoot: string,
  icon: string,
};

interface Entity {
  data: {
    attributes: object,
    relationships: object,
  }
}

interface Props {
  schema: SchemaProp,
  onSave: (data: object) => any,
  entityTypeId: string,
  bundle: string,
  requestUiSchema: (entityTypeId: string, bundle: string) => any,
  uiSchema: {fieldSchema: {},fieldStorageConfig:{},  formDisplaySchema:{}},
  restorableEntity: Entity,
  setErrorMessage: (message: string) => any,
  onChange: (bundle: string, entity: Entity) => any,
  entity: Entity,
};

interface State {
  entity: Entity,
  restored: boolean,
  schema: {
    uiSchema: {},
  },
};

class NodeForm extends React.Component<Props,State> {

  static defaultProps = {
    schema: false,
    uiSchema: false,
    restorableEntity: null,
    onChange: () => {},
  };

  state = {
    restored: false,
    entity: {
      data: {
        attributes: {},
        relationships: {},
      }
    },
    schema:{
      uiSchema: {}
    }
  };

  componentDidMount() {
    // @ts-ignore
    this.props.requestUiSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
    // ts-ignore
    this.calculateState(this.props, this.state, (state: State)  => this.setState(state));
  }

  componentDidUpdate() {
    this.calculateState(this.props, this.state, (state: State) => this.setState(state));
  }

  // @ts-ignore
  onAttributeChange = (fieldName: string) => data => {
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
    const missingFields = this.resolveMissingRequiredFields();
    if (missingFields.length) {
      this.props.setErrorMessage(
        missingFields.length > 1
          ? `The following fields are missing, ${missingFields.join(', ')}.`
          : `The following field is missing, ${missingFields.join('')}.`,
      );
    } else {
      this.props.onSave(this.state.entity.data);
    }
  };

  onRelationshipChange = (fieldName: string) => (data: any) => {
    // Support widgets with multiple cardinality.
    let fieldData: object;
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

  getSchemaInfo = (schema: any, fieldName: string) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  resolveMissingRequiredFields = () => {
    const unavailableFields = ['nid', 'uuid', 'vid', 'path'];
    const requiredFields = this.props.schema.properties.data.properties.attributes.required.filter(
      (file: string): boolean => !unavailableFields.includes(file),
    );
    return Object.entries(this.state.entity.data.attributes)
      .filter(([fieldName]) => requiredFields.includes(fieldName))
      .filter(([fieldName, value]) => {
        // @todo Ideally the schema would identify the main property for us.
        if (
          typeof value === 'object' &&
          Object.keys(value).length &&
          // @ts-ignore
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

  calculateState = (prevProps: Props, prevState:State, setState: any) => {
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
    state.entity.data.attributes = Object.entries(state.entity.data.attributes)
      .filter(([key]) =>
        Object.keys(prevProps.uiSchema.formDisplaySchema)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});

    setState(state);
  };

  createField = ({ fieldName, widget, inputProps }: {fieldName: string, widget: any, inputProps: any}) => {
    // @todo We need to pass along props.
    // @todo How do we handle cardinality together with jsonapi
    // making a distinction between single value fields and multi value fields.
    const fieldSchema = this.getSchemaInfo(this.props.schema, fieldName);

    const {
      attributes,
      relationships,
    } = this.props.schema.properties.data.properties;

    const propType =
      // @ts-ignore
      (attributes.properties[fieldName] && 'attributes') ||
      // @ts-ignore
      (relationships.properties[fieldName] && 'relationships');

    const widgetProps = {
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
    };

    const widgetComponent = widget.component;
    const widgetIsMultiple = widget.multiple || false;
    const hasMultipleDeltas =
      (fieldSchema.type && fieldSchema.type === 'array') ||
      (fieldSchema.properties &&
        fieldSchema.properties.data &&
        fieldSchema.properties.data.type === 'array');

    return hasMultipleDeltas && !widgetIsMultiple ? (
      <MultipleFields component={widgetComponent} {...widgetProps} />
    ) : (
      React.createElement(widgetComponent, widgetProps)
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
    if (this.props.schema && this.props.uiSchema && this.state.entity) {
      const { right, left } = sortUISchemaFields(
        createUISchema(
          this.props.uiSchema.fieldSchema,
          this.props.uiSchema.formDisplaySchema,
          this.props.uiSchema.fieldStorageConfig,
          widgets,
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

const mapStateToProps = (state: State, { bundle, entityTypeId }: {bundle: string, entityTypeId: string}) => ({
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
});

export default connect(
  mapStateToProps,
  {
    requestUiSchema,
    contentAdd,
    setErrorMessage,
  },
  // @ts-ignore
)(NodeForm);
