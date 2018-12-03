import React from 'react';

import api from 'drupal-admin-ui/src/api';

class ModerationStateDefaultWidget extends React.Component {
  state = {
    loaded: false,
    data: null,
  };

  componentDidMount() {
    api('workflow')
      .then(console.log);
  }

}

export default ModerationStateDefaultWidget;
