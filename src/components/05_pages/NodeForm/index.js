import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { css } from 'emotion';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import Widgets from './Widgets';
import PageTitle from '../../02_atoms/PageTitle';

import { requestSchema, contentAdd } from '../../../actions/content';
import { createEntity } from '../../../utils/api/schema';

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
    schema: PropTypes.oneOfType([schemaType, PropTypes.bool]),
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
  };

  static defaultProps = {
    schema: false,
  };

  static getDerivedStateFromProps(props, prevState) {
    if (!props.schema) {
      return prevState;
    }

    const state = {
      ...prevState,
      // @todo figure out relationships.
      entity: props.entity || {
        ...createEntity(props.schema),
        relationships: {},
      },
    };
    // Just contain values which are in the ui metadata.
    state.entity.data.attributes = Object.entries(state.entity.data.attributes)
      .filter(([key]) =>
        Object.keys(props.uiMetadata)
          .concat(['type'])
          .includes(key),
      )
      .reduce((agg, [key, value]) => ({ ...agg, [key]: value }), {});
    return state;
  }

  componentDidMount() {
    this.props.requestSchema();
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
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  render() {
    return (
      <Fragment>
        <PageTitle>Create {this.props.bundle}</PageTitle>
        {this.props.schema && (
          <Paper>
            <div className={styles.container}>
              <FormControl margin="normal" fullWidth>
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
});

export default connect(
  mapStateToProps,
  {
    requestSchema,
    contentAdd,
  },
)(NodeForm);
