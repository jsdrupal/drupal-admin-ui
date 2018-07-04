import React, { Fragment } from 'react';
import Widgets from './Widgets';

class NodeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entity: {},
    };
  }

  onFieldChange = fieldName => data => {
    this.setState(prevState => {
      return {
        entity: {
          ...prevState.entity,
          [fieldName]: data,
        },
      };
    });
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
                onChange: this.onFieldChange(fieldName),
              });
            }
          })
          .filter(x => x)}
      </Fragment>
    );
  }
}

export default NodeForm;
