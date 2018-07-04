import React, { Fragment } from 'react';
import Widgets from './Widgets';

class NodeForm extends React.Component {
  render() {
    return (<Fragment>
      {Object.entries(this.props.uiMetadata)
        .map(([, { widget }]) => {
          if (Widgets[widget]) {
            // @todo We need to pass along props.
            return React.createElement(this.props.widgets[widget]);
          }
        })
        .filter(x => x)}
    </Fragment>);
  }
}

export default NodeForm;
