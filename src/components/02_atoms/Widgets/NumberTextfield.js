import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const NumberTextfield = props => (
  <TextField
    id={props.fieldName}
    value={props.value}
    onChange={event => props.onChange(event.target.value)}
    inputProps={props.inputProps}
    type="number"
    margin="normal"
    label={props.label}
  />
);

NumberTextfield.propTypes = {
  ...WidgetPropTypes,
  inputProps: PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
  }),
  value: PropTypes.string,
};

NumberTextfield.defaultProps = {
  inputProps: {
    min: 0,
  },
  value: '',
};

export default NumberTextfield;
