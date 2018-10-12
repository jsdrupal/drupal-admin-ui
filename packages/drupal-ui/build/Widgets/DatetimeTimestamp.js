import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var DatetimeTimestamp = function DatetimeTimestamp(_ref) {
  var classes = _ref.classes,
      fieldName = _ref.fieldName,
      label = _ref.label,
      value = _ref.value,
      _onChange = _ref.onChange,
      required = _ref.required;
  return React.createElement(TextField, {
    id: fieldName,
    fullWidth: true,
    label: label,
    type: 'datetime-local',
    defaultValue: value ? new Date(value * 1000).toJSON().slice(0, 19) : null,
    margin: 'normal',
    onChange: function onChange(event) {
      return _onChange(+new Date(event.target.value) / 1000);
    },
    InputLabelProps: {
      shrink: true
    },
    classes: classes,
    required: required
  });
};

DatetimeTimestamp.propTypes = Object.assign({}, WidgetPropTypes, {
  value: PropTypes.number,
  required: PropTypes.bool.isRequired
});

DatetimeTimestamp.defaultProps = {
  value: 0
};

export default DatetimeTimestamp;