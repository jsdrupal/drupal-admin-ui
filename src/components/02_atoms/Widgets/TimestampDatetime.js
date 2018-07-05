import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const TimestampDatetime = ({ fieldName, label, value }) => (
  <TextField
    id={fieldName}
    label={label}
    type="datetime-local"
    value={value}
    InputLabelProps={{
      shrink: true,
    }}
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
