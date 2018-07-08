import React from 'react';
import PropTypes from 'prop-types';

import Message from '../../02_atoms/Message/Message';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  componentDidCatch(error) {
    this.setState({
      error,
    });
  }

  render() {
    if (this.state.error) {
      return <Message message={this.state.error.toString()} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
