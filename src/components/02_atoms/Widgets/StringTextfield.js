import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const StringTextfield = props => (
  <TextField
    id={props.fieldName}
    value={
      (Array.isArray(props.value) && props.value.length && props.value[0]) ||
      props.value
    }
    onChange={event => props.onChange(event.target.value)}
    margin="normal"
    label={props.label}
    classes={props.classes}
    required={props.required}
    autoFocus={props.autoFocus}
    fullWidth
  />
);

StringTextfield.propTypes = {
  ...WidgetPropTypes,
  // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  autoFocus: PropTypes.bool,
};

StringTextfield.defaultProps = {
  value: '',
  autoFocus: false,
};

export default StringTextfield;
