import * as React from 'react';

import InlineMessage from '../../02_atoms/InlineMessage/InlineMessage';

import { MESSAGE_SEVERITY } from '../../../constants/message_severity';

interface State {
  error: Error;
}

class ErrorBoundary extends React.Component<{}, State> {
  constructor(...args: any) {
    // @ts-ignore
    super(...args);

    // this.state = {
    //   error: null,
    // };
  }

  componentDidCatch(error: Error) {
    this.setState({
      error,
    });
  }

  render() {
    // @ts-ignore
    if (this.state.error) {
      return (
        <InlineMessage
          message={this.state.error.toString()}
          messageSeverity={MESSAGE_SEVERITY.ERROR}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
