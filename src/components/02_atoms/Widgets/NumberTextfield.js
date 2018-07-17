import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const NumberTextfield = ({ label, value, onChange, fieldName, inputProps }) => (
  <TextField
    id={fieldName}
    value={value}
    onChange={event => onChange(event.target.value)}
    InputProps={{
      inputProps,
      endAdornment: inputProps.suffix && (
        <InputAdornment position="end">{inputProps.suffix}</InputAdornment>
      ),
      startAdornment: inputProps.prefix && (
        <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
      ),
    }}
    type="number"
    margin="normal"
    label={label}
  />
);

NumberTextfield.propTypes = {
  ...WidgetPropTypes,
  inputProps: PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    suffix: PropTypes.string,
    prefix: PropTypes.string,
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
