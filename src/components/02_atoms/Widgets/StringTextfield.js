import React from 'react';

class StringTextfield extends React.Component {
  render() {
    return (
      <input
        onChange={event => this.props.onChange(event.target.value)}
        type="text"
      />
    );
  }
}

export default StringTextfield;
