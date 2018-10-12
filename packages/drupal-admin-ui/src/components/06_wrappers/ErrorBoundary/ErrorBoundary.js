import React from 'react';
import PropTypes from 'prop-types';

import { InlineMessage } from 'drupal-ui';

import { MESSAGE_SEVERITY_ERROR } from '../../../constants/messages';

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
      return (
        <InlineMessage
          message={this.state.error.toString()}
          messageSeverity={MESSAGE_SEVERITY_ERROR}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
