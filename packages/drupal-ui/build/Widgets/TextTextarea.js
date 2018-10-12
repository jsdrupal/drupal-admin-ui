var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    .public-DraftEditor-content {\n      min-height: 110px;\n    }\n  '], ['\n    .public-DraftEditor-content {\n      min-height: 110px;\n    }\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    margin-bottom: 10px;\n  '], ['\n    margin-bottom: 10px;\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import RichTextEditor from 'react-rte';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';

var styles = void 0;

/**
 * Some basic wysiwyg editor based upon react-rte which is based upon draft.js.
 * This was designed to be as easiest as possible for the demo.
 *
 * On the longrun we might want to switch back to ckeditor.
 */

var TextTextarea = function (_React$Component) {
  _inherits(TextTextarea, _React$Component);

  function TextTextarea() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TextTextarea);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TextTextarea.__proto__ || Object.getPrototypeOf(TextTextarea)).call.apply(_ref, [this].concat(args))), _this), _this.createValueFromString = function (props) {
      return RichTextEditor.createValueFromString(
      // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
      Array.isArray(props.value) && props.value.length && props.value[0].value || props.value.value || '', 'html');
    }, _this.extractValueString = function (props) {
      return Array.isArray(props.value) && props.value.length && props.value[0].value || props.value.value || '';
    }, _this.state = {
      value: _this.createValueFromString(_this.props),
      valueString: _this.extractValueString(_this.props)
    }, _this.componentDidUpdate = function (prevProps) {
      if (_this.props.value.value !== prevProps.value.value && _this.extractValueString(_this.props) !== _this.state.valueString) {
        _this.setState({
          value: _this.createValueFromString(_this.props)
        });
      }
    }, _this.onChange = function (value) {
      var valueString = value.toString('html');
      _this.setState({ value: value, valueString: valueString }, function () {
        // Send the changes up to the parent component as an HTML string.
        // This is here to demonstrate using `.toString()` but in a real app it
        // would be better to avoid generating a string on each change.
        _this.props.onChange({
          value: valueString,
          format: 'basic_html'
        });
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // eslint-disable-next-line react/sort-comp


  _createClass(TextTextarea, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        FormControl,
        { margin: 'normal', fullWidth: true, required: this.props.required },
        React.createElement(
          FormLabel,
          { classes: { root: styles.label } },
          this.props.label
        ),
        React.createElement(RichTextEditor, {
          className: styles.container,
          value: this.state.value,
          onChange: this.onChange
        })
      );
    }
  }]);

  return TextTextarea;
}(React.Component);

TextTextarea.propTypes = Object.assign({}, WidgetPropTypes, {
  value: PropTypes.oneOfType([PropTypes.shape({
    value: PropTypes.string.isRequired
  }), PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired
  }))])
});
TextTextarea.defaultProps = {
  value: {
    value: '',
    format: 'basic_html'
  }
};


styles = {
  container: css(_templateObject),
  label: css(_templateObject2)
};

export default TextTextarea;