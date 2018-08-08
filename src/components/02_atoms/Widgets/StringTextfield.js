import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const StringTextfield = props => (
  <TextField
    id={props.fieldName}
    value={props.value}
    onChange={event => props.onChange(event.target.value)}
    margin="normal"
    label={props.label}
    required={props.inputProps.required}
  />
);

StringTextfield.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.string,
};

StringTextfield.defaultProps = {
  value: '',
};

export default StringTextfield;
