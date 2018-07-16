import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { css } from 'emotion';

import Widgets from './Widgets';
import { createEntity } from '../../../utils/api/schema';
import { contentAdd } from '../../../actions/content';

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

const styles = {
  container: css`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  `,
};

class NodeForm extends React.Component {
  static propTypes = {
    entity: PropTypes.shape({}),
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
    contentAdd: PropTypes.func.isRequired,
    bundleType: PropTypes.string.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
  };

  static defaultProps = {
    schema: {},
    entity: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      // @todo figure out relationships.
      entity: this.props.entity || {
        ...createEntity(this.props.schema),
        relationships: {},
      },
    };
    // Just contain values which are in the ui metadata.
    this.state.entity.attributes = Object.entries(this.state.entity.attributes)
      .filter(([key]) =>
        Object.keys(this.props.uiMetadata)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});
  }

  onFieldChange = fieldName => data => {
    this.setState(prevState => ({
      entity: {
        ...prevState.entity,
        attributes: {
          ...prevState.entity.attributes,
          [fieldName]: data,
        },
      },
    }));
  };

  onSave = () => {
    // @todo Fill in values for fields without a field widget yet.
    const { entity } = this.state;
    entity.attributes.field_summary = entity.attributes.field_summary || {
      value: 'Empty',
      format: 'basic_html',
    };
    entity.attributes.field_recipe_instruction = entity.attributes
      .field_recipe_instruction || {
      value: 'Empty',
      format: 'basic_html',
    };
    entity.attributes.field_preparation_time =
      entity.attributes.field_preparation_time || 0;

    entity.relationships = entity.relationships || {};
    entity.relationships.field_author = entity.relationships.field_author || {};
    entity.relationships.field_author.data = {
      type: 'user--user',
      id: '425db657-f642-4979-b12a-b0347c2906b6',
    };

    entity.relationships.field_image = entity.relationships.field_image || {};
    entity.relationships.field_image.data = {
      type: 'file--file',
      id: 'ad861ab2-81d7-4ff6-afb8-316ef3ee03df',
      meta: {
        alt:
          'A delicious deep layered Mediterranean quiche with basil garnish.',
        title: null,
        width: 768,
        height: 511,
      },
    };

    this.props.contentAdd({
      ...entity,
      type: this.props.bundleType,
    });
  };

  getSchemaInfo = (schema, fieldName) =>
    this.props.schema.properties.attributes.properties[fieldName] ||
    this.props.schema.properties.relationships.properties[fieldName];

  render() {
    return (
      <form className={styles.container}>
        {Object.entries(this.props.uiMetadata)
          .map(([fieldName, { widget }]) => {
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
              });
            }
            return null;
          })
          .filter(x => x)}

        <Button variant="contained" color="primary" onClick={this.onSave}>
          Save
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(
  connect(
    () => ({}),
    {
      contentAdd,
    },
  )(NodeForm),
);
