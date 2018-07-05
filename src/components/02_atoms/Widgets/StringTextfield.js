import React from 'react';
import TextField from '@material-ui/core/TextField';

class StringTextfield extends React.Component {
  render() {
    return (
      <TextField
        id={this.props.fieldName}
        value={this.props.value}
        onChange={event => this.props.onChange(event.target.value)}
        margin="normal"
        label={this.props.label}
      />
    );
  }
}

export default StringTextfield;
