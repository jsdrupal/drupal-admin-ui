import React from 'react';

import api from 'drupal-admin-ui/src/api';

class ModerationStateDefaultWidget extends React.Component {
  state = {
    loaded: false,
    data: null,
  };

  componentDidMount() {
    api('workflow', {}, {
      query: {
        // @todo pull this from the schema.
        filter: { condition: { path: 'id', value: 'test' } },
      },
    })
      .then(data => {
        this.setState({
          loaded: true,
          data,
        })
      });
  }

  render() {
    // Use the possible options from this.state.data to
    // use a select element.
  }

}

export default ModerationStateDefaultWidget;
