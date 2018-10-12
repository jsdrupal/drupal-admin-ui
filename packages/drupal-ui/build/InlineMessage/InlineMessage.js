var _modifierClassMap;

var _templateObject = _taggedTemplateLiteral(['\n    padding: 20px 25px;\n    margin-bottom: 30px;\n    color: #fff;\n  '], ['\n    padding: 20px 25px;\n    margin-bottom: 30px;\n    color: #fff;\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    background-color: #43a047;\n  '], ['\n    background-color: #43a047;\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    background-color: #d32f2f;\n  '], ['\n    background-color: #d32f2f;\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    background-color: #1976d2;\n  '], ['\n    background-color: #1976d2;\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    background-color: #ffa000;\n  '], ['\n    background-color: #ffa000;\n  ']);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { MESSAGE_SEVERITY_ERROR, MESSAGE_SEVERITY_SUCCESS, MESSAGE_SEVERITY_INFO, MESSAGE_SEVERITY_WARNING } from '../../../drupal-admin-ui/src/constants/messages';

var styles = void 0;
var modifierClassMap = void 0;

var Message = function Message(_ref) {
  var message = _ref.message,
      messageSeverity = _ref.messageSeverity;
  return React.createElement(
    'div',
    { className: styles.message + ' ' + modifierClassMap[messageSeverity] },
    message
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  messageSeverity: PropTypes.oneOf([MESSAGE_SEVERITY_ERROR, MESSAGE_SEVERITY_SUCCESS, MESSAGE_SEVERITY_INFO, MESSAGE_SEVERITY_WARNING]).isRequired
};

styles = {
  message: css(_templateObject),
  success: css(_templateObject2),
  error: css(_templateObject3),
  info: css(_templateObject4),
  warning: css(_templateObject5)
};

modifierClassMap = (_modifierClassMap = {}, _defineProperty(_modifierClassMap, MESSAGE_SEVERITY_ERROR, styles.error), _defineProperty(_modifierClassMap, MESSAGE_SEVERITY_SUCCESS, styles.success), _defineProperty(_modifierClassMap, MESSAGE_SEVERITY_WARNING, styles.warning), _defineProperty(_modifierClassMap, MESSAGE_SEVERITY_INFO, styles.info), _modifierClassMap);

export default Message;