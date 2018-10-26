import React from 'react';
import PropTypes from 'prop-types';

import asyncDefine from 'async-define';

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
      const script = document.createElement('script');
      document.body.appendChild(script);

      script.async = true;
      script.crossOrigin = true;

      script.onload = () => {
        asyncDefine(`jsDrupal_${this.props.name}_widget`, component => {
          debugger;
          this.setState({ component })
        })
        // const component = window[this.props.name]; // eslint-ignore-line
        // this.setState({ component });
      };
      script.src = this.props.component;
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
