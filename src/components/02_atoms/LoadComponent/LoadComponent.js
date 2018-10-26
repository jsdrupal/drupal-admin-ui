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
      window.System.import(this.props.component).then(component =>
        this.setState({ component }),
      );
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
