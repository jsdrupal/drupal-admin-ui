import React from 'react';

import { api } from '@drupal/admin-ui-utilities';

class ModerationStateDefaultWidget extends React.Component {
  state = {
    loaded: false,
    data: null,
  };

  componentDidMount() {
    console.log(api);
    api('entity', {
      parameters: {
        entityType: 'workflow',
      },
      queryString: {
        // @todo pull this from the schema.
        filter: { condition: { path: 'id', value: 'test' } },
      },
    }).then(data => {
      this.setState({
        loaded: true,
        data,
      });
    });
  }

  render() {
    console.log(this.state.data);
    // Use the possible options from this.state.data to
    // use a select element.
    return '123';
  }
}

export default ModerationStateDefaultWidget;
