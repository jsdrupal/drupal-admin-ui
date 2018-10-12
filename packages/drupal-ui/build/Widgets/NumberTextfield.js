import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var NumberTextfield = function NumberTextfield(_ref) {
  var classes = _ref.classes,
      label = _ref.label,
      value = _ref.value,
      _onChange = _ref.onChange,
      fieldName = _ref.fieldName,
      required = _ref.required,
      inputProps = _ref.inputProps;
  return React.createElement(TextField, {
    id: fieldName,
    value: value,
    fullWidth: true,
    onChange: function onChange(event) {
      return _onChange(Number(event.target.value));
    },
    InputProps: Object.assign({}, inputProps, {
      unsigned: inputProps.unsigned.toString(),
      endAdornment: inputProps.suffix && React.createElement(
        InputAdornment,
        { position: 'end' },
        inputProps.suffix
      ),
      startAdornment: inputProps.prefix && React.createElement(
        InputAdornment,
        { position: 'start' },
        inputProps.prefix
      )
    }),
    type: 'number',
    margin: 'normal',
    label: label,
    classes: classes,
    required: required
  });
};

NumberTextfield.propTypes = Object.assign({}, WidgetPropTypes, {
  inputProps: PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    suffix: PropTypes.string,
    prefix: PropTypes.string
  }),
  value: PropTypes.number
});

NumberTextfield.defaultProps = {
  inputProps: {
    min: 0
  },
  value: ''
};

export default NumberTextfield;