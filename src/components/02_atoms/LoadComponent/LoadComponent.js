import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel, FormControl, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core';

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
      // Cheat and load "React"
      window.define('react', () => React);
      window.define('@material-ui/core/InputLabel', () => InputLabel);
      window.define('@material-ui/core/FormControl', () => FormControl);
      window.define('@material-ui/core/FormGroup', () => FormGroup);
      window.define('@material-ui/core/FormControlLabel', () => FormControlLabel);
      window.define('@material-ui/core/Checkbox', () => Checkbox);
      window.define('@material-ui/core/FormHelperText', () => FormHelperText);
      window.require([this.props.component], ({ default: component}) => {
        this.setState({ component })
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
