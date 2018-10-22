import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const NumberTextfield = ({
  classes,
  label,
  value,
  onChange,
  fieldName,
  required,
  inputProps,
}) => (
  <TextField
    id={fieldName}
    value={value}
    fullWidth
    onChange={event => onChange(Number(event.target.value))}
    InputProps={{
      ...inputProps,
      unsigned: inputProps.unsigned && inputProps.unsigned.toString(),
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
    classes={classes}
    required={required}
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
  value: PropTypes.number,
};

NumberTextfield.defaultProps = {
  inputProps: {
    min: 0,
  },
  value: '',
};

export default NumberTextfield;
