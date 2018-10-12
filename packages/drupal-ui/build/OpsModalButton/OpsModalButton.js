var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return React.createElement(Slide, Object.assign({ direction: 'up' }, props));
}

/* A Drupal specific button, for use in the operations column of a table.
 *
 * Typically a Add, Edit or Delete icon can be provided as a child element
 * see for example  '@material-ui/icons/Add'
 *
 * When pressed a modal dialog slides up into view.
 */

var OpsModalButton = function (_React$Component) {
  _inherits(OpsModalButton, _React$Component);

  function OpsModalButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, OpsModalButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OpsModalButton.__proto__ || Object.getPrototypeOf(OpsModalButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      open: false
    }, _this.handleClickOpen = function () {
      _this.setState({ open: true });
    }, _this.handleClose = function () {
      _this.setState({ open: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OpsModalButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      // Pass all props except those consumed here down into the button.
      var _props = this.props,
          title = _props.title,
          text = _props.text,
          cancelText = _props.cancelText,
          confirmText = _props.confirmText,
          enterAction = _props.enterAction,
          buttonProps = _objectWithoutProperties(_props, ['title', 'text', 'cancelText', 'confirmText', 'enterAction']);

      return React.createElement(
        Fragment,
        null,
        React.createElement(
          IconButton,
          Object.assign({}, buttonProps, { onClick: this.handleClickOpen }),
          this.props.children
        ),
        React.createElement(
          Dialog,
          {
            open: this.state.open,
            TransitionComponent: Transition,
            onClose: this.handleClose
          },
          React.createElement(
            DialogTitle,
            null,
            title
          ),
          React.createElement(
            DialogContent,
            null,
            React.createElement(
              DialogContentText,
              null,
              text
            )
          ),
          React.createElement(
            DialogActions,
            null,
            React.createElement(
              Button,
              {
                onClick: function onClick() {
                  enterAction();
                  _this2.handleClose();
                },
                color: 'primary'
              },
              confirmText
            ),
            React.createElement(
              Button,
              { onClick: this.handleClose, color: 'primary' },
              cancelText
            )
          )
        )
      );
    }
  }]);

  return OpsModalButton;
}(React.Component);

OpsModalButton.propTypes = {
  /**
   * The dialog title.
   */
  title: PropTypes.string.isRequired,
  /**
   * The text below the dialog title.
   */
  text: PropTypes.string.isRequired,
  /**
   * The confirm button label.
   */
  confirmText: PropTypes.string.isRequired,
  /**
   * The cancel button label.
   */
  cancelText: PropTypes.string.isRequired,
  /**
   * Children of the button.
   */
  children: PropTypes.node.isRequired,
  /**
   * Called when the confirm button is pressed.
   */
  enterAction: PropTypes.func.isRequired
};


export default OpsModalButton;