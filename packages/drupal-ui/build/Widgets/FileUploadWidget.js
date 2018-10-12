var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  margin-top: 15px;\n'], ['\n  margin-top: 15px;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  width: 100%;\n\n  legend {\n    margin-bottom: 10px;\n  }\n\n  .remove {\n    margin-left: auto;\n  }\n'], ['\n  width: 100%;\n\n  legend {\n    margin-bottom: 10px;\n  }\n\n  .remove {\n    margin-left: auto;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  > img {\n    max-width: 100px;\n    margin-right: 20px;\n  }\n'], ['\n  > img {\n    max-width: 100px;\n    margin-right: 20px;\n  }\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n    width: 100%;\n  '], ['\n    width: 100%;\n  ']);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { css } from 'emotion';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import WidgetPropTypes from '../../../drupal-admin-ui/src/components/05_pages/NodeForm/WidgetPropTypes';
import FileUpload from '../FileUpload/FileUpload';
import { deleteItemById, getItemsAsArray, setItemById } from '../../../drupal-admin-ui/src/utils/api/fieldItem';
import api from '../../../drupal-admin-ui/src/utils/api/api';

var CardWrapper = styled('div')(_templateObject);

var Element = styled('div')(_templateObject2);

var Image = styled('div')(_templateObject3);

var styles = {
  fullWidth: css(_templateObject4)
};

var FileUploadWidget = function (_React$Component) {
  _inherits(FileUploadWidget, _React$Component);

  function FileUploadWidget() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FileUploadWidget);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FileUploadWidget.__proto__ || Object.getPrototypeOf(FileUploadWidget)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selectedItems: null
    }, _this.setSelectedItems = function (items) {
      _this.setState({
        selectedItems: items
      }, function () {
        _this.props.onChange({
          data: _this.state.selectedItems
        });
      });
    }, _this.recalculateSelectedItems = function () {
      var entityTypeId = 'file';
      var bundle = 'file';

      var multiple = _this.props.schema.properties.data.type === 'array';
      var items = getItemsAsArray(multiple, _this.props.value.data);
      var ids = items.map(function (_ref2) {
        var id = _ref2.id;
        return id;
      });
      _this.fetchEntitites(entityTypeId, bundle, ids).then(function (_ref3) {
        var entities = _ref3.data;

        _this.setState({
          selectedItems: entities.map(function (_ref4, index) {
            var _ref5;

            var id = _ref4.id,
                attributes = _ref4.attributes;
            return _ref5 = {
              id: id,
              type: 'file--file'
            }, _defineProperty(_ref5, entityTypeId, attributes), _defineProperty(_ref5, 'meta', items[index].meta), _ref5;
          }).reduce(function (agg, item) {
            return setItemById(multiple, item, agg);
          }, multiple ? [] : {})
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
          bundle: bundle
        }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FileUploadWidget, [{
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

      var _props = this.props,
          value = _props.value,
          label = _props.label,
          bundle = _props.bundle,
          fieldName = _props.fieldName,
          inputProps = _props.inputProps,
          entityTypeId = _props.entityTypeId,
          required = _props.required,
          _props$schema = _props.schema,
          properties = _props$schema.properties,
          maxItems = _props$schema.maxItems,
          classes = _props.classes;


      if (this.state.selectedItems === null) {
        return null;
      }

      // If array then allow for multiple uploads.
      var multiple = properties.data.type === 'array';

      var items = getItemsAsArray(multiple, this.state.selectedItems)
      // Default schema creates stub entries, which we don't need here.
      .filter(function (item) {
        return item.id;
      });
      var length = items && items.length || 0;
      // maxItems is only set if array, so set to 1 as default.
      var maxItemsCount = multiple ? maxItems || 100000000000 : 1;

      return React.createElement(
        FormControl,
        {
          margin: 'normal',
          required: required,
          classes: classes,
          fullWidth: true
        },
        React.createElement(
          Element,
          null,
          React.createElement(
            FormLabel,
            { component: 'legend' },
            label
          ),
          React.createElement(
            'div',
            {
              className: styles.fullWidth,
              style: {
                display: !multiple && length || length === maxItemsCount ? 'none' : 'block'
              }
            },
            React.createElement(FileUpload, {
              bundle: bundle,
              multiple: multiple,
              fieldName: fieldName,
              inputProps: inputProps,
              entityTypeId: entityTypeId,
              remainingUploads: maxItemsCount - length,
              onFileUpload: function onFileUpload(files) {
                var newItems = files.reduce(function (itemsAgg, file) {
                  var item = {
                    file: {
                      type: 'file--file',
                      url: file.url[0].value,
                      id: file.uuid[0].value,
                      filename: file.filename[0].value
                    },
                    meta: { alt: '' },
                    id: file.uuid[0].value,
                    type: 'file--file'
                  };
                  return setItemById(multiple, item, itemsAgg);
                }, items);

                _this2.setSelectedItems(newItems);
              }
            })
          ),
          length > 0 && React.createElement(
            CardWrapper,
            null,
            React.createElement(
              Card,
              null,
              React.createElement(
                CardContent,
                null,
                React.createElement(
                  List,
                  null,
                  items.map(function (item, index) {
                    var id = item.id,
                        alt = item.meta.alt,
                        _item$file = item.file,
                        url = _item$file.url,
                        filename = _item$file.filename;

                    var last = items.length - 1 === index;

                    return React.createElement(
                      Fragment,
                      { key: id },
                      React.createElement(
                        ListItem,
                        null,
                        React.createElement(
                          Image,
                          null,
                          React.createElement('img', {
                            alt: alt || filename,
                            src: '' + process.env.REACT_APP_DRUPAL_BASE_URL + url
                          })
                        ),
                        React.createElement(TextField, {
                          required: true,
                          value: alt,
                          margin: 'normal',
                          label: 'Alternative text',
                          onChange: function onChange(event) {
                            return _this2.setSelectedItems(setItemById(multiple, Object.assign({}, item, {
                              meta: {
                                alt: event.target.value
                              }
                            }), value.data));
                          }
                        }),
                        React.createElement(
                          Button,
                          {
                            mini: true,
                            id: id,
                            variant: 'fab',
                            color: 'secondary',
                            className: 'remove',
                            'aria-label': 'Remove Image',
                            onClick: function onClick(event) {
                              _this2.setSelectedItems(deleteItemById(multiple, event.currentTarget.id, items));
                            }
                          },
                          React.createElement(DeleteIcon, null)
                        )
                      ),
                      !last && React.createElement(Divider, null)
                    );
                  })
                )
              )
            )
          )
        )
      );
    }
  }]);

  return FileUploadWidget;
}(React.Component);

var filePropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.string,
  filename: PropTypes.string.isRequired
});

var fileItemMultiplePropType = PropTypes.shape({
  id: PropTypes.toString.isRequired,
  file: filePropType.isRequired
});

var fileItemSinglePropType = PropTypes.shape({
  file: filePropType.isRequired
});

FileUploadWidget.propTypes = Object.assign({}, WidgetPropTypes, {
  value: PropTypes.shape({
    data: PropTypes.shape({
      file: PropTypes.oneOfType([PropTypes.arrayOf(fileItemMultiplePropType), fileItemSinglePropType]),
      meta: PropTypes.shape({
        alt: PropTypes.string
      })
    })
  }),
  inputProps: PropTypes.shape({
    file_extensions: PropTypes.string,
    max_filesize: PropTypes.string
  }),
  schema: PropTypes.shape({
    maxItems: PropTypes.number,
    properties: PropTypes.shape({
      data: PropTypes.shape({
        type: PropTypes.string.isRequired
      })
    })
  }).isRequired
});

FileUploadWidget.defaultProps = {
  value: { data: { file: {}, meta: {} } },
  inputProps: {
    file_extensions: 'png gif jpg jpeg',
    max_filesize: '2000000'
  }
};

export default FileUploadWidget;