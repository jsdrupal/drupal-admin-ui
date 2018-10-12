var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n    tr:hover,\n    tr:focus {\n      background: #f7fcff;\n    }\n  '], ['\n    tr:hover,\n    tr:focus {\n      background: #f7fcff;\n    }\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    border-bottom: 1px solid #c7c7c7;\n  '], ['\n    border-bottom: 1px solid #c7c7c7;\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    padding: 10px 12px;\n    text-align: left;\n  '], ['\n    padding: 10px 12px;\n    text-align: left;\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { css, cx } from 'emotion';
import PropTypes from 'prop-types';

var styles = void 0;

var TABLE = function TABLE(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  return React.createElement(
    'table',
    Object.assign({ className: styles.table }, props),
    children
  );
};
TABLE.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

var TR = function TR(_ref2) {
  var children = _ref2.children,
      props = _objectWithoutProperties(_ref2, ['children']);

  return React.createElement(
    'tr',
    props,
    children
  );
};
TR.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

var TD = function TD(_ref3) {
  var children = _ref3.children,
      props = _objectWithoutProperties(_ref3, ['children']);

  return React.createElement(
    'td',
    props,
    children
  );
};
TD.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

var THEAD = function THEAD(_ref4) {
  var data = _ref4.data;
  return React.createElement(
    'thead',
    null,
    React.createElement(
      TR,
      { className: styles.tr },
      data.map(function (label) {
        return React.createElement(
          TD,
          { className: styles.td, key: 'column-' + label },
          label
        );
      })
    )
  );
};
THEAD.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired
};

var TBODY = function TBODY(_ref5) {
  var rows = _ref5.rows;
  return React.createElement(
    'tbody',
    { className: styles.tbody },
    rows.map(function (_ref6) {
      var colspan = _ref6.colspan,
          tds = _ref6.tds,
          key = _ref6.key;
      return React.createElement(
        TR,
        { key: key, className: styles.tr },
        tds.map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 3),
              tdKey = _ref8[0],
              tdValue = _ref8[1],
              tdClassName = _ref8[2];

          return React.createElement(
            TD,
            {
              className: cx(styles.td, tdClassName || ''),
              key: tdKey,
              colSpan: colspan || undefined
            },
            tdValue
          );
        })
      );
    })
  );
};
TBODY.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    colspan: PropTypes.number,
    key: PropTypes.string,
    tds: PropTypes.arrayOf(PropTypes.node).isRequired
  })).isRequired
};

styles = {
  thead: css(_templateObject),
  tbody: css(_templateObject2),
  tr: css(_templateObject3),
  td: css(_templateObject4)
};

export { TR, TD, TABLE as Table, TBODY as TBody, THEAD as THead };