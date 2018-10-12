var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _templateObject = _taggedTemplateLiteral(['\n    min-width: 182px;\n  '], ['\n    min-width: 182px;\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var styles = {
  select: css(_templateObject)
};

var OptionsSelect = function OptionsSelect(_ref) {
  var label = _ref.label,
      value = _ref.value,
      _onChange = _ref.onChange,
      helpText = _ref.helpText,
      fieldName = _ref.fieldName,
      required = _ref.required,
      defaultValue = _ref.schema.default,
      classes = _ref.classes,
      allowedValues = _ref.inputProps.allowed_values;
  return React.createElement(
    FormControl,
    { margin: 'normal', classes: classes },
    React.createElement(
      InputLabel,
      { htmlFor: fieldName, required: required },
      label
    ),
    React.createElement(
      NativeSelect,
      {
        value: value || defaultValue,
        fullWidth: true,
        onChange: function onChange(event) {
          return _onChange(event.target.value);
        },
        inputProps: {
          name: fieldName,
          id: fieldName
        },
        className: styles.select
      },
      Object.entries(allowedValues).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            machineName = _ref3[0],
            humanName = _ref3[1];

        return React.createElement(
          'option',
          { key: machineName, value: machineName },
          humanName
        );
      })
    ),
    helpText && React.createElement(
      FormHelperText,
      null,
      helpText
    )
  );
};

OptionsSelect.propTypes = Object.assign({}, WidgetPropTypes, {
  value: PropTypes.string,
  helpText: PropTypes.string,
  schema: PropTypes.shape({
    default: PropTypes.string.isRequired
  }).isRequired,
  inputProps: PropTypes.shape({
    allowed_values: PropTypes.object.isRequired
  }).isRequired
});

OptionsSelect.defaultProps = {
  value: '',
  helpText: ''
};

export default OptionsSelect;