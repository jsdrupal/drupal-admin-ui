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
    defaultValue={value ? new Date(value * 1000).toJSON().slice(0, 19) : null}
    margin="normal"
    onChange={event => onChange(+new Date(event.target.value) / 1000)}
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
  value: 0,
};

export default DatetimeTimestamp;
