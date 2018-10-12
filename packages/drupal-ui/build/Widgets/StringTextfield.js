import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var StringTextfield = function StringTextfield(props) {
  return React.createElement(TextField, {
    id: props.fieldName,
    value: Array.isArray(props.value) && props.value.length && props.value[0] || props.value,
    onChange: function onChange(event) {
      return props.onChange(event.target.value);
    },
    margin: 'normal',
    label: props.label,
    classes: props.classes,
    required: props.required,
    autoFocus: props.autoFocus,
    fullWidth: true
  });
};

StringTextfield.propTypes = Object.assign({}, WidgetPropTypes, {
  // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  autoFocus: PropTypes.bool
});

StringTextfield.defaultProps = {
  value: '',
  autoFocus: false
};

export default StringTextfield;