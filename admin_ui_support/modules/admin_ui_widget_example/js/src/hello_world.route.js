import React, { Component, Fragment } from 'react';
import { api } from '@drupal/admin-ui-utilities';

class HelloWorld extends Component {
  state = { routes: false };

  componentDidMount() {
    api('admin_ui_routes').then(({ routes }) => this.setState({ routes }));
  }

  render() {
    return this.state.routes ? (
      <Fragment>
        {Object.values(this.state.routes).map(({ route, moduleName }) => (
          <p key={route}>
            {route} : {moduleName}
          </p>
        ))}
      </Fragment>
    ) : (
      <p>routes loading</p>
    );
  }
}

export default HelloWorld;
