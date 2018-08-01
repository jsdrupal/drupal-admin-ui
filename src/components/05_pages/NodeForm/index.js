import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import PageTitle from '../../02_atoms/PageTitle';

import { requestSchema } from '../../../actions/content';
import { requestUIConfigSchema } from '../../../actions/schema';

const lazyFunction = f => (props, propName, componentName, ...rest) =>
  f(props, propName, componentName, ...rest);

let schemaType;
const lazySchemaType = lazyFunction(() => schemaType);

schemaType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  properties: PropTypes.objectOf(lazyFunction(lazySchemaType)),
}).isRequired;

let styles;

class NodeForm extends React.Component {
  static propTypes = {
    schema: schemaType,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
      ]).isRequired,
    ).isRequired,
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    requestSchema: PropTypes.func.isRequired,
    requestUIConfigSchema: PropTypes.func.isRequired,
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

  constructor(props) {
    super(props);

    this.state = {
      entity: {},
    };
  }

  componentDidMount() {
    this.props.requestSchema();
    this.props.requestUIConfigSchema({
      entityTypeId: this.props.entityTypeId,
      bundle: this.props.bundle,
    });
  }

  onFieldChange = fieldName => data => {
    this.setState(prevState => ({
      entity: {
        ...prevState.entity,
        [fieldName]: data,
      },
    }));
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  render() {
    return (
      <Fragment>
        <PageTitle>Create {this.props.bundle}</PageTitle>
        {this.props.schema &&
          this.props.uiSchema && (
            <Paper>
              <div className={styles.container}>
                <FormControl margin="normal" fullWidth>
                  {Array.from(
                    new Set([
                      ...Object.keys(this.props.uiSchema.fieldSchema),
                      ...Object.keys(this.props.uiSchema.formDisplaySchema),
                    ]),
                  )
                    .map(fieldName => {
                      const {
                        fieldSchema,
                        formDisplaySchema,
                      } = this.props.uiSchema;

                      if (
                        Object.keys(this.props.widgets).filter(name =>
                          formDisplaySchema[fieldName].type.startsWith(name),
                        ).length
                      ) {
                        // @todo We need to pass along props.
                        // @todo How do we handle cardinality together with jsonapi
                        // making a distinction between single value fields and multi value fields.
                        const entityFieldSchema = this.getSchemaInfo(
                          this.props.schema,
                          fieldName,
                        );

                        const fieldSchemaSettings = Object.prototype.hasOwnProperty.call(
                          fieldSchema,
                          fieldName,
                        )
                          ? fieldSchema[fieldName].attributes.settings
                          : {};
                        const formDisplaySettings = Object.prototype.hasOwnProperty.call(
                          formDisplaySchema,
                          fieldName,
                        )
                          ? formDisplaySchema[fieldName].settings
                          : {};

                        const [widgetMachineName] = Object.keys(
                          this.props.widgets,
                        ).filter(name =>
                          formDisplaySchema[fieldName].type.startsWith(name),
                        );
                        const FieldWidget = this.props.widgets[
                          widgetMachineName
                        ];

                        return React.createElement(FieldWidget, {
                          key: fieldName,
                          entityTypeId: this.props.entityTypeId,
                          bundle: this.props.bundle,
                          fieldName,
                          value: this.state.entity[fieldName],
                          label: entityFieldSchema && entityFieldSchema.title,
                          schema: entityFieldSchema,
                          onChange: this.onFieldChange(fieldName),
                          inputProps: {
                            ...fieldSchemaSettings,
                            ...formDisplaySettings,
                          },
                        });
                      }
                      return null;
                    })
                    .filter(x => x)}
                </FormControl>
                <Divider classes={{ root: styles.divider }} />
                <Button variant="contained" color="primary" onClick={() => {}}>
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
  schema: state.content.schema[`${entityTypeId}--${bundle}`],
  uiSchema: state.schema.uiSchema[`${entityTypeId}--${bundle}`],
});

export default connect(
  mapStateToProps,
  {
    requestSchema,
    requestUIConfigSchema,
  },
)(NodeForm);
