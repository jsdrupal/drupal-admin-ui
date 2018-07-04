import React from 'react';
import { TextField } from '@material-ui/core/es/index';

class StringTextfield extends React.Component {
  render() {
    return (
      <TextField
        id={this.props.fieldName}
        value={this.props.value}
        onChange={event => this.props.onChange(event.target.value)}
        margin="normal"
      />
    );
  }
}

export default StringTextfield;
