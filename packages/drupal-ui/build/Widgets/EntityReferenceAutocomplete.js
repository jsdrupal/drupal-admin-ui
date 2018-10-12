var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    position: absolute;\n    z-index: 900;\n  '], ['\n    position: absolute;\n    z-index: 900;\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    width: 100%;\n  '], ['\n    width: 100%;\n  ']);

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';
import SchemaPropType from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/SchemaPropType';

import api from '../../../drupal-admin-ui/src/utils/api/api';
import { getItemsAsArray } from '../../../drupal-admin-ui/src/utils/api/fieldItem';

var styles = {
  results: css(_templateObject),
  fullWidth: css(_templateObject2)
};

var EntityReferenceAutocomplete = function (_React$Component) {
  _inherits(EntityReferenceAutocomplete, _React$Component);

  function EntityReferenceAutocomplete() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, EntityReferenceAutocomplete);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EntityReferenceAutocomplete.__proto__ || Object.getPrototypeOf(EntityReferenceAutocomplete)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      inputValue: '',
      selectedItems: null,
      suggestions: new Map()
    }, _this.getMaxItems = function () {
      var _this$props$schema = _this.props.schema,
          maxItems = _this$props$schema.maxItems,
          properties = _this$props$schema.properties;

      var multiple = properties.data.type === 'array';
      return multiple ? maxItems || 100000000000 : 1;
    }, _this.recalculateSelectedItems = function () {
      var _this$determineEntity = _this.determineEntityTypeAndBundlesFromSchema(_this.props.schema),
          _this$determineEntity2 = _slicedToArray(_this$determineEntity, 2),
          entityTypeId = _this$determineEntity2[0],
          _this$determineEntity3 = _slicedToArray(_this$determineEntity2[1], 1),
          bundle = _this$determineEntity3[0];

      var multiple = _this.props.schema.properties.data.type === 'array';
      var items = getItemsAsArray(multiple, _this.props.value.data);
      var ids = items.map(function (_ref2) {
        var id = _ref2.id;
        return id;
      });
      _this.fetchEntitites(entityTypeId, bundle, ids).then(function (_ref3) {
        var entities = _ref3.data;

        _this.setState({
          selectedItems: entities.map(function (_ref4) {
            var id = _ref4.id,
                label = _ref4.attributes.name;
            return {
              id: id,
              label: label,
              type: (_this.props.schema.properties.data.items || _this.props.schema.properties.data).properties.type.enum[0]
            };
          })
        });
      });
    }, _this.handleChange = function (_ref5) {
      var id = _ref5.id,
          label = _ref5.label;
      return _this.setState(function (_ref6) {
        var selectedItems = _ref6.selectedItems;
        return {
          inputValue: '',
          selectedItems: Object.assign({}, selectedItems, _defineProperty({}, id, {
            id: id,
            label: label,
            // Figure out a better way to handle this.
            type: (_this.props.schema.properties.data.items || _this.props.schema.properties.data).properties.type.enum[0]
          }))
        };
      }, function () {
        _this.props.onChange(_this.state.selectedItems);
      });
    }, _this.handleInputChange = function (event) {
      if (_this.state.selectedItems && _this.getMaxItems() === Object.keys(_this.state.selectedItems).length) {
        return;
      }

      _this.setState({ inputValue: event.target.value }, function () {
        if (!_this.state.inputValue.length) {
          return;
        }

        // @todo Move this call to the mounting component?

        var _this$determineEntity4 = _this.determineEntityTypeAndBundlesFromSchema(_this.props.schema),
            _this$determineEntity5 = _slicedToArray(_this$determineEntity4, 2),
            entityTypeId = _this$determineEntity5[0],
            _this$determineEntity6 = _slicedToArray(_this$determineEntity5[1], 1),
            bundle = _this$determineEntity6[0];

        _this.fetchSuggestedEntities(entityTypeId, bundle, _this.state.inputValue).then(function (_ref7) {
          var items = _ref7.data;

          _this.setState({
            suggestions: new Map(items.map(function (_ref8) {
              var id = _ref8.id,
                  label = _ref8.attributes.name;
              return [id, { id: id, label: label }];
            }))
          });
        });
      });
    }, _this.fetchEntitites = function (entityTypeId, bundle, ids) {
      return api(entityTypeId, {
        queryString: {
          filter: {
            id: {
              condition: {
                operator: 'IN',
                path: 'uuid',
                value: ids
              }
            }
          }
        },
        parameters: {
          type: bundle
        }
      });
    }, _this.fetchSuggestedEntities = function (bundle, type, input) {
      return api(bundle, {
        queryString: {
          filter: {
            // @todo On the longrun fetch the label_key from the entity type
            //   definition.
            name: {
              condition: {
                path: 'name',
                operator: 'CONTAINS',
                value: input
              }
            }
          }
        },
        parameters: {
          type: type
        }
      });
    }, _this.handleKeyDown = function (event) {
      var _this$state = _this.state,
          inputValue = _this$state.inputValue,
          selectedItems = _this$state.selectedItems;

      if (selectedItems && selectedItems.length && !inputValue.length && keycode(event) === 'backspace') {
        _this.setState({
          selectedItems: selectedItems.slice(0, selectedItems.length - 1)
        }, function () {
          return _this.props.onChange(_this.state.selectedItems);
        });
      }
    }, _this.handleDelete = function (id) {
      return function () {
        _this.setState(function (state) {
          var selectedItems = state.selectedItems;

          delete selectedItems[id];
          return { selectedItems: selectedItems };
        }, function () {
          return _this.props.onChange(_this.state.selectedItems);
        });
      };
    }, _this.determineEntityTypeAndBundlesFromSchema = function (schema) {
      // For some reason different entity references have different schema.
      var resourceNames = (schema.properties.data.items || schema.properties.data).properties.type.enum;
      return resourceNames.map(function (name) {
        return name.split('--');
      }).reduce(function (_ref9, _ref10) {
        var _ref12 = _slicedToArray(_ref9, 2),
            _ref12$ = _ref12[1],
            bundles = _ref12$ === undefined ? [] : _ref12$;

        var _ref11 = _slicedToArray(_ref10, 2),
            entityTypeId = _ref11[0],
            bundle = _ref11[1];

        return [entityTypeId, [].concat(_toConsumableArray(bundles), [entityTypeId === bundle ? undefined : bundle])];
      }, []);
    }, _this.renderSuggestion = function (_ref13) {
      var suggestion = _ref13.suggestion,
          index = _ref13.index,
          itemProps = _ref13.itemProps,
          highlightedIndex = _ref13.highlightedIndex,
          selectedItems = _ref13.selectedItem;

      if (selectedItems && _this.getMaxItems() === Object.keys(selectedItems).length) {
        return null;
      }

      var isHighlighted = highlightedIndex === index;
      var isSelected = selectedItems && Object.keys(selectedItems).includes(suggestion.id);

      return React.createElement(
        MenuItem,
        Object.assign({}, itemProps, {
          key: suggestion.id,
          selected: isHighlighted,
          component: 'div',
          style: {
            fontWeight: isSelected ? 500 : 400
          }
        }),
        suggestion.label
      );
    }, _this.renderInput = function (_ref14) {
      var InputProps = _ref14.InputProps,
          ref = _ref14.ref,
          label = _ref14.label,
          other = _objectWithoutProperties(_ref14, ['InputProps', 'ref', 'label']);

      return React.createElement(TextField, Object.assign({
        label: label,
        id: InputProps.id,
        InputProps: Object.assign({
          inputRef: ref
        }, InputProps, {
          inputProps: {
            autoComplete: 'off'
          }
        })
      }, other));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EntityReferenceAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.selectedItems && this.props.value && this.props.value.data) {
        this.recalculateSelectedItems();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.value && this.props.value.data && prevProps.value.data !== this.props.value.data) {
        this.recalculateSelectedItems();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          inputValue = _state.inputValue,
          selectedItems = _state.selectedItems;
      var fieldName = this.props.fieldName;

      return React.createElement(
        FormControl,
        {
          margin: 'normal',
          required: this.props.required,
          classes: this.props.classes,
          fullWidth: true
        },
        React.createElement(
          Downshift,
          {
            inputValue: inputValue,
            onChange: this.handleChange,
            selectedItem: selectedItems,
            itemToString: function itemToString(item) {
              return item ? item.label : '';
            }
          },
          function (_ref15) {
            var getInputProps = _ref15.getInputProps,
                getItemProps = _ref15.getItemProps,
                isOpen = _ref15.isOpen,
                selectedItem = _ref15.selectedItem,
                highlightedIndex = _ref15.highlightedIndex;
            return React.createElement(
              'div',
              { className: styles.fullWidth },
              _this2.renderInput({
                fullWidth: true,
                label: _this2.props.label,
                InputProps: getInputProps({
                  startAdornment: selectedItems ? /* eslint-disable prettier/prettier */
                  Object.entries(selectedItems).map(function (_ref16) {
                    var _ref17 = _slicedToArray(_ref16, 2),
                        key = _ref17[0],
                        value = _ref17[1];

                    return React.createElement(Chip, {
                      key: key,
                      tabIndex: -1,
                      label: value.label,
                      className: 'chip',
                      onDelete: _this2.handleDelete(key)
                    });
                  }) : [],
                  /* eslint-enable prettier/prettier */
                  onChange: _this2.handleInputChange,
                  onKeyDown: _this2.handleKeyDown,
                  placeholder: '',
                  id: fieldName
                })
              }),
              isOpen ? React.createElement(
                Paper,
                {
                  className: styles.results + ' ' + styles.fullWidth,
                  square: true
                },
                !!_this2.state.inputValue.length && Array.from(_this2.state.suggestions.values()).map(function (suggestion, index) {
                  return _this2.renderSuggestion({
                    suggestion: suggestion,
                    index: index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex: highlightedIndex,
                    selectedItem: selectedItem
                  });
                })
              ) : null
            );
          }
        )
      );
    }
  }]);

  return EntityReferenceAutocomplete;
}(React.Component);

EntityReferenceAutocomplete.propTypes = Object.assign({}, WidgetPropTypes, {
  schema: SchemaPropType.isRequired,
  required: PropTypes.bool.isRequired,
  inputProps: PropTypes.shape({
    bundle: PropTypes.string,
    type: PropTypes.string
  })
});
EntityReferenceAutocomplete.defaultProps = {
  inputProps: {}
};


export default EntityReferenceAutocomplete;