import React from 'react';

import { api } from '@drupal/admin-ui-utilities';

class ModerationStateDefaultWidget extends React.Component {
  state = {
    loaded: false,
    workflow: null,
  };

  componentDidMount() {
    console.log('props', this.props);
    api('entity', {
      parameters: {
        entityType: 'workflow',
      },
      queryString: {
        // @todo pull this from the schema.
        filter: { condition: { path: 'id', value: 'default' } },
      },
    }).then(response => {
      if (response.data && response.data.length) {
        this.setState({
          loaded: true,
          workflow: response.data[0],
        });
      }
    });
  }

  render() {
    console.log('workflow', this.state.workflow);
    // Use the possible options from this.state.data to
    // use a select element.
    return '123';
  }
}

export default ModerationStateDefaultWidget;
