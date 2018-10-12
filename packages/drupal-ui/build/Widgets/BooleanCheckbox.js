var _templateObject = _taggedTemplateLiteral(['\n    align-items: center;\n  '], ['\n    align-items: center;\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { css } from 'emotion';
import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var styles = void 0;

var BooleanCheckbox = function BooleanCheckbox(props) {
  var _onChange = props.onChange,
      label = props.label,
      value = props.value;


  return React.createElement(FormControlLabel, {
    id: props.fieldName + '-label',
    control: React.createElement(CheckBox, {
      id: props.fieldName + '-cb',
      onChange: function onChange(event) {
        return _onChange(event.target.checked);
      },
      margin: 'normal',
      value: String(value),
      checked: value
    }),
    label: label,
    classes: styles,
    required: props.required
  });
};

BooleanCheckbox.propTypes = Object.assign({}, WidgetPropTypes, {
  value: PropTypes.bool
});

BooleanCheckbox.defaultProps = {
  value: false
};

styles = {
  root: css(_templateObject)
};

export default BooleanCheckbox;