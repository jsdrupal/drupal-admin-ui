import React from 'react';
import PropTypes from 'prop-types';
import PrettyError from 'pretty-error';

import InlineMessage from '../../02_atoms/InlineMessage/InlineMessage';

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
      const pe = new PrettyError();

      return (
        <InlineMessage
          message={pe.render(this.state.error)}
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
