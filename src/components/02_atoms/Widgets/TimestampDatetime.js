import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const TimestampDatetime = ({ classes, fieldName, label, value, onChange }) => (
  <TextField
    id={fieldName}
    label={label}
    type="datetime-local"
    defaultValue={value}
    margin="normal"
    onChange={event => onChange(event.target.value)}
    InputLabelProps={{
      shrink: true,
    }}
    classes={classes}
  />
);

TimestampDatetime.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.string,
};

TimestampDatetime.defaultProps = {
  value: '',
};

export default TimestampDatetime;
