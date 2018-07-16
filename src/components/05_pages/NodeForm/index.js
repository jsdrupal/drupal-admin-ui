import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import Widgets from './Widgets';

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
    uiMetadata: PropTypes.objectOf(
      PropTypes.shape({
        widget: PropTypes.string.isRequired,
        constraints: PropTypes.array,
      }),
    ).isRequired,
    schema: schemaType,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
      ]).isRequired,
    ).isRequired,
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
  };

  static defaultProps = {
    schema: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      entity: {},
    };
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
    this.props.schema.properties.attributes.properties[fieldName] ||
    this.props.schema.properties.relationships.properties[fieldName];

  render() {
    return (
      <form className={styles.container}>
        {Object.entries(this.props.uiMetadata)
          .map(([fieldName, { widget, inputProps }]) => {
            if (Widgets[widget]) {
              // @todo We need to pass along props.
              // @todo How do we handle cardinality together with jsonapi
              // making a distinction between single value fields and multi value fields.
              const fieldSchema = this.getSchemaInfo(
                this.props.schema,
                fieldName,
              );

              return React.createElement(this.props.widgets[widget], {
                key: fieldName,
                entityTypeId: this.props.entityTypeId,
                bundle: this.props.bundle,
                fieldName,
                value: this.state.entity[fieldName],
                label: fieldSchema && fieldSchema.title,
                schema: fieldSchema,
                onChange: this.onFieldChange(fieldName),
                inputProps,
              });
            }
            return null;
          })
          .filter(x => x)}
      </form>
    );
  }
}

styles = {
  container: css`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  `,
};

export default NodeForm;
