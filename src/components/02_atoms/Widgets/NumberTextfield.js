import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const NumberTextfield = props => (
  <TextField
    id={props.fieldName}
    value={props.value}
    onChange={event => props.onChange(event.target.value)}
    type="number"
    margin="normal"
    label={props.label}
  />
);

NumberTextfield.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.string,
};

NumberTextfield.defaultProps = {
  value: 0,
};

export default NumberTextfield;
