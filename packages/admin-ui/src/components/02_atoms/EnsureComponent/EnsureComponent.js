import React from 'react';
import PropTypes from 'prop-types';
import * as MaterialUI from '@material-ui/core';
import api from '../../../utils/api/api';

class EnsureComponent extends React.Component {
  state = {
    component: null,
  };

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      .isRequired,
    render: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (typeof this.props.component === 'string') {
      // Cheat and load "React"
      window.define('react', () => React);
      window.define('@drupal/admin-ui-utilities', () => ({ api }));
      Object.keys(MaterialUI).forEach(key =>
        window.define(`@material-ui/core/${key}`, () => MaterialUI[key]),
      );
      window.require([this.props.component], ({ default: component }) => {
        this.setState({ component });
      });
    } else {
      this.setState({
        component: this.props.component,
      });
    }
  }

  render() {
    if (this.state.component) {
      return this.props.render(this.state.component);
    }
    return null;
  }
}

export default EnsureComponent;
