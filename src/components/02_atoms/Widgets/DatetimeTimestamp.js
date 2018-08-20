import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const DatetimeTimestamp = ({
  classes,
  fieldName,
  label,
  value,
  onChange,
  required,
}) => (
  <TextField
    id={fieldName}
    fullWidth
    label={label}
    type="datetime-local"
    defaultValue={value}
    margin="normal"
    onChange={event => onChange(Number(event.target.value))}
    InputLabelProps={{
      shrink: true,
    }}
    classes={classes}
    required={required}
  />
);

DatetimeTimestamp.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.number,
  required: PropTypes.bool.isRequired,
};

DatetimeTimestamp.defaultProps = {
  value: '',
};

export default DatetimeTimestamp;
