import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import Widgets from './Widgets';
import PageTitle from '../../02_atoms/PageTitle';

import { requestSchema } from '../../../actions/content';

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
    requestSchema: PropTypes.func.isRequired,
  };

  static defaultProps = {
    schema: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      entity: {},
      restorableEntity: null,
    };
  }

  componentDidMount() {
    this.props.requestSchema();
    this.loadFromLocalStorage();
  }

  onFieldChange = fieldName => data => {
    this.setState(
      prevState => ({
        entity: {
          ...prevState.entity,
          [fieldName]: data,
        },
      }),
      this.storeToLocalStorage,
    );
  };

  getSchemaInfo = (schema, fieldName) =>
    schema.properties.data.properties.attributes.properties[fieldName] ||
    schema.properties.data.properties.relationships.properties[fieldName];

  restoreLoadedContent = () => {
    // When editing content we don't want to override content which was touched in the meantime.
    if (
      this.state.entity.created &&
      this.state.entity.created > this.state.restorableEntity
    ) {
      return;
    }
    this.setState(
      {
        entity: this.state.restorableEntity,
        restorableEntity: null,
      },
      () => {
        window.localStorage.removeItem(
          `drupal_admin_ui__node_${this.props.bundle}`,
        );
      },
    );
  };

  storeToLocalStorage = () => {
    // @todo Once we can save nodes we should take into account at least the ID/UUID here.
    if (window.localStorage) {
      const item = JSON.stringify(this.state.entity);
      window.localStorage.setItem(
        `drupal_admin_ui__node_${this.props.bundle}`,
        item,
      );
    }
  };

  loadFromLocalStorage = () => {
    if (window.localStorage) {
      const item = window.localStorage.getItem(
        `drupal_admin_ui__node_${this.props.bundle}`,
      );
      if (item) {
        this.setState({
          restorableEntity: JSON.parse(item),
        });
      }
    }
  };

  render() {
    return (
      <Fragment>
        <PageTitle>Create {this.props.bundle}</PageTitle>
        {this.state.restorableEntity && (
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
                onClick={this.restoreLoadedContent}
              >
                Restore
              </Button>,
            ]}
          />
        )}
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
  },
)(NodeForm);
