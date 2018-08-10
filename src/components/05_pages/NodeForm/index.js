import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import LoadingBar from 'react-redux-loading-bar';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import SchemaPropType from './SchemaPropType';
import PageTitle from '../../02_atoms/PageTitle';

import { contentAdd } from '../../../actions/content';
import { requestSchema, requestUiSchema } from '../../../actions/schema';

import { createEntity, createUISchema } from '../../../utils/api/schema';

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
  };

  static defaultProps = {
    schema: false,
    uiSchema: false,
  };

  static getDerivedStateFromProps(props, prevState) {
    if (!props.schema) {
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
        Object.keys(props.uiSchema)
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

  onSave = () => {
    // @todo Remove in https://github.com/jsdrupal/drupal-admin-ui/issues/245
    const { data: entity } = this.state.entity;

    entity.attributes.field_summary = entity.attributes.field_summary || {
      value: 'Empty',
      format: 'basic_html',
    };
    entity.attributes.field_recipe_instruction = entity.attributes
      .field_recipe_instruction || {
      value: 'Empty',
      format: 'basic_html',
    };

    const data = {
      ...entity,
      type: `${this.props.entityTypeId}--${this.props.bundle}`,
    };
    this.props.contentAdd(data);
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  render() {
    return (
      <Fragment>
        <PageTitle>Create {this.props.bundle}</PageTitle>
        <LoadingBar style={{ position: 'relative', marginBottom: '5px' }} />
        {this.props.schema &&
          this.props.uiSchema && (
            <Paper>
              <div className={styles.container}>
                <FormControl margin="normal" fullWidth>
                  {createUISchema(
                    this.props.uiSchema.fieldSchema,
                    this.props.uiSchema.formDisplaySchema,
                    this.props.widgets,
                  )
                    .map(({ fieldName, widget, inputProps }) => {
                      // @todo We need to pass along props.
                      // @todo How do we handle cardinality together with jsonapi
                      // making a distinction between single value fields and multi value fields.
                      const fieldSchema = this.getSchemaInfo(
                        this.props.schema,
                        fieldName,
                      );

                      const {
                        attributes,
                        relationships,
                      } = this.props.schema.properties.data.properties;

                      const propType =
                        (attributes.properties[fieldName] && 'attributes') ||
                        (relationships.properties[fieldName] &&
                          'relationships');

                      return React.createElement(widget, {
                        key: fieldName,
                        entityTypeId: this.props.entityTypeId,
                        bundle: this.props.bundle,
                        fieldName,
                        value: this.state.entity.data[propType][fieldName],
                        label: fieldSchema && fieldSchema.title,
                        schema: fieldSchema,
                        onChange: (propType === 'attributes'
                          ? this.onAttributeChange
                          : this.onRelationshipChange)(fieldName),
                        inputProps,
                      });
                    })
                    .filter(x => x)}
                </FormControl>
                <Divider classes={{ root: styles.divider }} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onSave}
                >
                  Save
                </Button>
              </div>
            </Paper>
          )}
      </Fragment>
    );
  }
}

styles = {
  container: css`
    padding: 5px 50px 40px;
  `,
  divider: css`
    margin: 30px 0;
  `,
};

const mapStateToProps = (state, { bundle, entityTypeId }) => ({
  schema: state.schema.schema[`${entityTypeId}--${bundle}`],
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
});

export default connect(
  mapStateToProps,
  {
    requestSchema,
    requestUiSchema,
    contentAdd,
  },
)(NodeForm);
