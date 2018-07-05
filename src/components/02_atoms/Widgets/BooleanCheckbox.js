import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@material-ui/core/Checkbox';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const BooleanCheckbox = props => (
  <CheckBox
    id={props.fieldName}
    checked={props.checked}
    onChange={event => props.onChange(event.target.value)}
    margin="normal"
    label={props.label}
  />
);

BooleanCheckbox.propTypes = {
  ...WidgetPropTypes,
  checked: PropTypes.boolean,
  label: PropTypes.string,
};

BooleanCheckbox.defaultProps = {
  checked: false,
  label: 'On',
};

export default BooleanCheckbox;
