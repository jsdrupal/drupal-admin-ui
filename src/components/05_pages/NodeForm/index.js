import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Widgets from './Widgets';

class NodeForm extends React.Component {
  static propTypes = {
    uiMetadata: PropTypes.object,
    schema: PropTypes.object,
    widgets: PropTypes.object,
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

  render() {
    return (
      <Fragment>
        {Object.entries(this.props.uiMetadata)
          .map(([fieldName, { widget }]) => {
            if (Widgets[widget]) {
              // @todo We need to pass along props.
              // @todo How do we handle cardinality together with jsonapi
              // making a distinction between single value fields and multi value fields.
              return React.createElement(this.props.widgets[widget], {
                key: { fieldName },
                value: this.state.entity[fieldName],
                label:
                  this.props.schema.properties.attributes.properties[
                    fieldName
                  ] &&
                  this.props.schema.properties.attributes.properties[fieldName]
                    .title,
                onChange: this.onFieldChange(fieldName),
              });
            }
            return null;
          })
          .filter(x => x)}
      </Fragment>
    );
  }
}

export default NodeForm;
