import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const BooleanCheckbox = props => {
  const { onChange, label, id, value, ...checkboxProps } = props;

  return (
    <FormControlLabel
      id={`${props.fieldName}-label`}
      control={
        <CheckBox
          id={`${props.fieldName}-cb`}
          onChange={event => onChange(event.target.value)}
          margin="normal"
          value={value}
          {...checkboxProps}
        />
      }
      label={label}
    />
  );
};

BooleanCheckbox.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.bool,
};

BooleanCheckbox.defaultProps = {
  value: false,
};

export default BooleanCheckbox;
