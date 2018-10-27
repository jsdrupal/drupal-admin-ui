import React from 'react';
import PropTypes from 'prop-types';

class LoadComponent extends React.Component {
  state = {
    component: null,
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (typeof this.props.component === 'string') {
      // fetch(this.props.component)
      //   .then(res => res.text())
      //   .then(file => {
      //
      //     eval(`${file}`);
      //     const component = window[`jsDrupal_${this.props.name}_widget`]; // eslint-ignore-line
      //     this.setState({ component });
      //   });
      // window.define(['require', this.props.component], (require) => {
      //   debugger;
      //   //debugger;
      //   // this.setState({ component });
      // })
      // const url = new URL(this.props.component);
      // debugger;
      // window.requirejs.config({
      //   baseUrl: `${process.env.REACT_APP_DRUPAL_BASE_URL}/modules/contrib/drupal-admin-ui-support/modules/admin_ui_widget_example/js/build`,
      // });
      window.require([this.props.component], (component) => {
        // debugger;
        this.setState({ component: component.default })
      })
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

export default LoadComponent;
