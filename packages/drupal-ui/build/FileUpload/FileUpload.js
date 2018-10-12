import _regeneratorRuntime from 'babel-runtime/regenerator';

var _templateObject = _taggedTemplateLiteral(['\n  width: 100%;\n'], ['\n  width: 100%;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  border: 2px dashed grey;\n  border-radius: 3px;\n  display: flex;\n  padding: 25px;\n  width: 100%;\n\n  > div {\n    width: 100%;\n  }\n'], ['\n  border: 2px dashed grey;\n  border-radius: 3px;\n  display: flex;\n  padding: 25px;\n  width: 100%;\n\n  > div {\n    width: 100%;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  margin: 0;\n  text-align: center;\n  .icon {\n    margin-left: 10px;\n  }\n'], ['\n  margin: 0;\n  text-align: center;\n  .icon {\n    margin-left: 10px;\n  }\n']);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LinearProgress from '@material-ui/core/LinearProgress';
import api from '../../../drupal-admin-ui/src/utils/api/api';

var Container = styled('div')(_templateObject);

var Element = styled('div')(_templateObject2);

var Text = styled('div')(_templateObject3);

var marginTopDense = {
  marginTop: '10px'
};

var marginTop = {
  marginTop: '20px'
};

var error = {
  color: 'red',
  paddingLeft: 0
};

var FileUpload = function (_Component) {
  _inherits(FileUpload, _Component);

  function FileUpload() {
    var _ref,
        _this4 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, FileUpload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FileUpload.__proto__ || Object.getPrototypeOf(FileUpload)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      total: 0,
      files: [],
      errors: [],
      filesLength: 0,
      isDisabled: false
    }, _this.onDragOver = function (event) {
      event.stopPropagation();
      event.preventDefault();
      _this.setElementStyles('red');
      event.dataTransfer.dropEffect = 'dragend';
    }, _this.onDragLeave = function (event) {
      event.stopPropagation();
      event.preventDefault();
      _this.setElementStyles();
    }, _this.onDrop = function (event) {
      event.stopPropagation();
      event.preventDefault();
      _this.readFile(event.dataTransfer.files);
    }, _this.onClick = function () {
      _this.input.click();
    }, _this.setElementStyles = function () {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'grey';
      var _this2 = _this,
          element = _this2.element,
          isDisabled = _this2.state.isDisabled;


      if (element) {
        element.style.border = '2px dashed ' + color;
        element.style.opacity = '' + (isDisabled ? '0.3' : '1');
      }
    }, _this.getFiles = function (event) {
      _this.readFile(event.target.files);
    }, _this.uploadFile = function (file) {
      var reader = new window.FileReader();

      reader.onloadend = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref2) {
          var _ref2$target = _ref2.target,
              readyState = _ref2$target.readyState,
              result = _ref2$target.result;

          var _this3, resetState, _this3$props, entityTypeId, bundle, fieldName, onFileUpload, _ref4, buffer, token, fileName, createdFile;

          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(readyState === window.FileReader.DONE)) {
                    _context.next = 11;
                    break;
                  }

                  _this3 = _this, resetState = _this3.resetState, _this3$props = _this3.props, entityTypeId = _this3$props.entityTypeId, bundle = _this3$props.bundle, fieldName = _this3$props.fieldName, onFileUpload = _this3$props.onFileUpload;
                  _ref4 = new Uint8Array(result), buffer = _ref4.buffer;
                  _context.next = 5;
                  return api('csrf_token');

                case 5:
                  token = _context.sent;

                  // Replace file name, some reason any space doesn't work
                  // TODO: Find a way to fix this without changing the name
                  fileName = file.name.replace(/[,#!$^&*;{}=\-+`~()[\] ]/g, '_');

                  // Upload the file to server

                  _context.next = 9;
                  return api('file:upload', {
                    parameters: {
                      bundle: bundle,
                      fileName: fileName,
                      fieldName: fieldName,
                      entityTypeId: entityTypeId,
                      body: buffer
                    },
                    options: {
                      headers: {
                        'X-CSRF-Token': token
                      }
                    }
                  });

                case 9:
                  createdFile = _context.sent;


                  _this.setState(function (prevState) {
                    return {
                      total: prevState.total + 1,
                      files: [].concat(_toConsumableArray(prevState.files), [createdFile])
                    };
                  }, function () {
                    onFileUpload(_this.state.files);
                    resetState();
                  });

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this4);
        }));

        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }();

      reader.readAsArrayBuffer(file);
    }, _this.checkFile = function (_ref5) {
      var type = _ref5.type,
          size = _ref5.size,
          name = _ref5.name,
          lastModified = _ref5.lastModified;

      /* eslint-disable camelcase */
      var errors = {};
      var extension = type.split('/')[1]; // <MIME_subtype>
      var _this5 = _this,
          resetState = _this5.resetState,
          _this5$props$inputPro = _this5.props.inputProps,
          max_filesize = _this5$props$inputPro.max_filesize,
          file_extensions = _this5$props$inputPro.file_extensions;

      // Check file size

      if (max_filesize && size > Number(max_filesize)) {
        // TODO: Convert max_filesize to MB
        errors.size = 'The file could not be saved because it exceeds 2 MB, the maximum allowed size for uploads.';
      }

      // Check file extension
      if (!file_extensions.includes(extension)) {
        errors.type = 'The image file is invalid or the image type is not allowed. Allowed types: ' + file_extensions + '.';
      }

      // Check if there are errors
      if (Object.keys(errors).length > 0) {
        errors.name = 'The specified file ' + name + ' could not be uploaded.';
        errors.id = lastModified;

        // Set the state with error and update total
        _this.setState(function (prevState) {
          return {
            total: prevState.total + 1,
            errors: [].concat(_toConsumableArray(prevState.errors), [errors])
          };
        }, resetState);
        return false;
      }

      return true;
      /* eslint-enable camelcase */
    }, _this.resetState = function () {
      var _this6 = _this,
          setElementStyles = _this6.setElementStyles,
          _this6$state = _this6.state,
          total = _this6$state.total,
          filesLength = _this6$state.filesLength;


      if (total === filesLength) {
        _this.setState({ files: [], filesLength: 0, total: 0, isDisabled: false }, setElementStyles);
      }
    }, _this.readFile = function (files) {
      var _this7 = _this,
          setElementStyles = _this7.setElementStyles,
          checkFile = _this7.checkFile,
          uploadFile = _this7.uploadFile,
          _this7$props = _this7.props,
          multiple = _this7$props.multiple,
          remainingUploads = _this7$props.remainingUploads;

      // Slice the files if more than the remaining uploads length

      var slicedFiles = Object.keys(files).slice(0, remainingUploads).reduce(function (obj, value) {
        obj[value] = files[value];
        return obj;
      }, {});

      _this.setState({
        errors: [],
        isDisabled: true,
        filesLength: Object.keys(slicedFiles).length
      }, setElementStyles);

      if (multiple) {
        Object.keys(slicedFiles).forEach(function (key) {
          var file = slicedFiles[key];
          if (checkFile(file)) {
            uploadFile(file);
          }
        });
      }

      // If single file upload, upload the first file from the dropped files
      if (!multiple && checkFile(slicedFiles[0])) {
        uploadFile(slicedFiles[0]);
      }
    }, _this.isEnabled = function (fn) {
      if (_this.state.isDisabled) {
        return null;
      }

      return fn;
    }, _this.render = function () {
      var _this8 = _this,
          onDrop = _this8.onDrop,
          onClick = _this8.onClick,
          getFiles = _this8.getFiles,
          isEnabled = _this8.isEnabled,
          onDragOver = _this8.onDragOver,
          onDragLeave = _this8.onDragLeave,
          _this8$state = _this8.state,
          total = _this8$state.total,
          errors = _this8$state.errors,
          isDisabled = _this8$state.isDisabled,
          filesLength = _this8$state.filesLength,
          _this8$props = _this8.props,
          multiple = _this8$props.multiple,
          remainingUploads = _this8$props.remainingUploads;


      return React.createElement(
        Container,
        null,
        React.createElement(
          Element,
          {
            onDrop: isEnabled(onDrop),
            onClick: isEnabled(onClick),
            onDragOver: isEnabled(onDragOver),
            onDragLeave: isEnabled(onDragLeave),
            innerRef: function innerRef(element) {
              _this.element = element;
            }
          },
          React.createElement(
            Text,
            null,
            React.createElement(
              Typography,
              { variant: 'subtitle1' },
              multiple ? 'Drop files or click here to upload.' : 'Drop a file or click here to upload.'
            ),
            React.createElement(
              Button,
              {
                size: 'small',
                color: 'primary',
                variant: 'contained',
                disabled: isDisabled,
                'aria-label': 'Upload Image/s',
                style: marginTop
              },
              'Upload ',
              React.createElement(CloudUploadIcon, { className: 'icon' })
            )
          ),
          React.createElement('input', {
            type: 'file',
            onChange: getFiles,
            multiple: multiple,
            style: { display: 'none' },
            ref: function ref(element) {
              _this.input = element;
            }
          })
        ),
        filesLength > 0 && React.createElement(LinearProgress, {
          style: marginTop,
          variant: 'determinate',
          value: total / filesLength * 100
        }),
        remainingUploads <= 15 && React.createElement(
          Typography,
          { component: 'p', style: marginTopDense },
          'Remaining uploads: ',
          remainingUploads
        ),
        errors.length > 0 && React.createElement(
          'div',
          null,
          React.createElement(
            Typography,
            { style: error, component: 'p' },
            'One or more files could not be uploaded.'
          ),
          React.createElement(
            Typography,
            { style: error, component: 'ul' },
            errors.map(function (_ref6) {
              var name = _ref6.name,
                  size = _ref6.size,
                  type = _ref6.type,
                  id = _ref6.id;
              return React.createElement(
                Typography,
                { style: error, component: 'li', key: id },
                name,
                React.createElement(
                  Typography,
                  { style: error, component: 'ul' },
                  size && React.createElement(
                    Typography,
                    { style: error, component: 'li' },
                    size
                  ),
                  type && React.createElement(
                    Typography,
                    { style: error, component: 'li' },
                    type
                  )
                )
              );
            })
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Initial state
   */


  /**
   * Will set the border of the element to red and
   * drop effect on drag over.
   * @param {Event} event
   */


  /**
   * Resets the border on drag leave.
   * @param {Event} event
   */


  /**
   * Will read the file/s that are dropped in the drop area.
   * @param {Event} event
   */


  /**
   * Will call the click event on the input to open the file explorer
   * to allow file/s to be selected.
   */


  /**
   * Sets the styles of the drop zone element.
   * Set the border and opacity.
   * @param {String} [color="grey"] Color of the border.
   */


  /**
   * Will get the selected file/s from the file explorer.
   * @param {Event} event
   */


  /**
   * Uploads the file to the server, updates the total and files state.
   * @param {Object} file File to be uploaded.
   */


  /**
   * Checks the current file has met all the criteria before
   * being uploaded to the server. If not then will set the
   * error state and update the total.
   * Will check file size and extension.
   * @param {String} type file type.
   * @param {Number} size file size.
   * @param {String} name file name.
   */


  /**
   * Resets the state if all file/s have been uploaded.
   */


  /**
   * Will read the file/s, check if multiple files can be uploaded,
   * check for errors, if no errors then upload the file.
   * @param {Object} files Selected files.
   */


  /**
   * If disabled, then prevent all file upload events.
   * @param {Function} fn Event function.
   */


  return FileUpload;
}(Component);

FileUpload.propTypes = {
  entityTypeId: PropTypes.string.isRequired,
  bundle: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  multiple: PropTypes.bool.isRequired,
  remainingUploads: PropTypes.number.isRequired,
  inputProps: PropTypes.shape({
    file_extensions: PropTypes.string,
    max_filesize: PropTypes.string
  }).isRequired
};


export default FileUpload;