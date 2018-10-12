var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  .icon {\n    margin-left: 10px;\n  }\n'], ['\n  .icon {\n    margin-left: 10px;\n  }\n']);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';
import ReorderIcon from '@material-ui/icons/Reorder';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { createEntity } from '../../../drupal-admin-ui/src/utils/api/schema';
import SchemaPropType from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/SchemaPropType';

var Add = styled('div')(_templateObject);

var style = {
  ListItemStyles: {
    paddingLeft: 0,
    paddingRight: 0
  },
  ListItemIconStyles: {
    cursor: 'move',
    margin: '0 0 0 16px'
  }
};

var MultipleFields = function (_Component) {
  _inherits(MultipleFields, _Component);

  function MultipleFields() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MultipleFields);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MultipleFields.__proto__ || Object.getPrototypeOf(MultipleFields)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      handle: null,
      currentIndex: -1,
      newItemAdded: false
    }, _this.onMouseDown = function (event) {
      _this.setState({
        handle: event.currentTarget
      });
    }, _this.onDragStart = function (event) {
      var _this2 = _this,
          value = _this2.props.value,
          handle = _this2.state.handle;

      // Don't allow dragging if not handle or only one item in props.value

      if (!event.target.contains(handle) || value.length === 1) {
        event.preventDefault();
        return;
      }
      // setData needed for FireFox, needs to setData to work
      event.dataTransfer.setData('text', '');
      event.dataTransfer.effectAllowed = 'move';
      var currentIndex = parseInt(event.currentTarget.dataset.key, 10);

      _this.setState({
        currentIndex: currentIndex
      });
    }, _this.onDragOver = function (event) {
      event.preventDefault();
      var _this3 = _this,
          value = _this3.props.value,
          currentIndex = _this3.state.currentIndex;


      var overIndex = parseInt(event.currentTarget.dataset.key, 10);
      if (currentIndex !== overIndex) {
        var selectedValue = value[currentIndex];
        // Changes the two values with one another
        value[currentIndex] = value[overIndex];
        value[overIndex] = selectedValue;

        _this.setState({
          currentIndex: overIndex
        });
      }
    }, _this.onDragEnd = function () {
      var _this$props = _this.props,
          value = _this$props.value,
          onChange = _this$props.onChange;

      _this.setState({
        handle: null,
        currentIndex: -1
      }, function () {
        onChange(value);
      });
    }, _this.changeItem = function (index) {
      return function (value) {
        var _this$props2 = _this.props,
            propsValue = _this$props2.value,
            onChange = _this$props2.onChange;

        var newValue = [].concat(_toConsumableArray(propsValue));
        newValue[index] = value;
        onChange(newValue);
      };
    }, _this.addAnotherItem = function () {
      var _this$props3 = _this.props,
          value = _this$props3.value,
          onChange = _this$props3.onChange;

      var newValue = [].concat(_toConsumableArray(value), ['']);
      _this.setState({
        newItemAdded: true
      }, function () {
        onChange(newValue);
      });
    }, _this.render = function () {
      var _this4 = _this,
          onDragEnd = _this4.onDragEnd,
          changeItem = _this4.changeItem,
          onDragOver = _this4.onDragOver,
          onDragLeave = _this4.onDragLeave,
          onDragStart = _this4.onDragStart,
          onMouseDown = _this4.onMouseDown,
          addAnotherItem = _this4.addAnotherItem,
          newItemAdded = _this4.state.newItemAdded,
          _this4$props = _this4.props,
          label = _this4$props.label,
          values = _this4$props.value,
          component = _this4$props.component,
          onChange = _this4$props.onChange;

      // values && values.length is to validate the object is not null and not an empty array, respectively
      // the last `&& values` is to make sure after validation, it always return `values`  instead of `values.length`

      var usedValues = values && values.length && values || [_this.createEmptyItem()];
      return React.createElement(
        FormControl,
        { margin: 'normal', fullWidth: true },
        React.createElement(
          FormLabel,
          { component: 'legend' },
          label
        ),
        React.createElement(
          List,
          null,
          usedValues && usedValues.map(function (value, index) {
            return React.createElement(
              ListItem,
              {
                draggable: true
                // eslint-disable-next-line react/no-array-index-key
                , key: index,
                'data-key': index,
                onDragEnd: onDragEnd,
                onDragOver: onDragOver,
                onDragLeave: onDragLeave,
                onDragStart: onDragStart,
                style: style.ListItemStyles
              },
              React.createElement(
                ListItemIcon,
                {
                  onMouseDown: onMouseDown,
                  style: style.ListItemIconStyles
                },
                React.createElement(ReorderIcon, null)
              ),
              React.createElement(
                ListItemText,
                null,
                React.createElement(component, Object.assign({}, _this.props, {
                  value: value,
                  label: '', // Enforce a hidden label
                  onChange: changeItem(index),
                  autoFocus: newItemAdded && index + 1 === values.length
                }))
              ),
              React.createElement(
                Fragment,
                null,
                React.createElement(
                  Button,
                  {
                    mini: true,
                    variant: 'fab',
                    color: 'secondary',
                    className: 'remove',
                    'aria-label': 'Remove Image',
                    onClick: function onClick() {
                      if (values.length > 1) {
                        values.splice(index, 1);
                        onChange(values);
                      }
                    }
                  },
                  React.createElement(DeleteIcon, null)
                )
              )
            );
          })
        ),
        React.createElement(
          Add,
          null,
          React.createElement(
            Button,
            {
              color: 'primary',
              variant: 'contained',
              onClick: addAnotherItem,
              'aria-label': 'Add another item'
            },
            'Add another item',
            React.createElement(AddIcon, null)
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Initial state
   */


  /**
   * Sets the state handle with the handle target.
   * @param {Event} event
   */


  /**
   * Sets the state value with the selected element.
   * @param {Event} event
   */


  /**
   * Changes the current value with the value that is under the
   * current value, and replace the over value with the current
   * value.
   * @param {Event} event
   */


  /**
   * Will update the state and call the onChange method
   * once the element has been reordered.
   */


  /**
   * Updated the current value of the input.
   * @param {Event} event
   * @param {String} value
   */


  /**
   * Adds another empty string to the current set of values.
   */


  _createClass(MultipleFields, [{
    key: 'createEmptyItem',
    value: function createEmptyItem() {
      return createEntity(this.props.schema.items);
    }
  }]);

  return MultipleFields;
}(Component);

MultipleFields.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  schema: SchemaPropType.isRequired
};


export default MultipleFields;