var _templateObject = _taggedTemplateLiteral(['\n  from {\n    transform: rotate(-10deg);\n  }\n  to {\n    transform: rotate(10deg);\n  }\n'], ['\n  from {\n    transform: rotate(-10deg);\n  }\n  to {\n    transform: rotate(10deg);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n    margin: 100px auto 0;\n  '], ['\n    margin: 100px auto 0;\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    display: inline-block;\n    vertical-align: middle;\n    animation-direction: alternate;\n    animation-iteration-count: infinite;\n    animation-duration: 0.5s;\n    animation-timing-function: cubic-bezier(0, 0, 1, 1);\n    transform-origin: bottom;\n    font-size: 50px;\n    animation-name: ', ';\n  '], ['\n    display: inline-block;\n    vertical-align: middle;\n    animation-direction: alternate;\n    animation-iteration-count: infinite;\n    animation-duration: 0.5s;\n    animation-timing-function: cubic-bezier(0, 0, 1, 1);\n    transform-origin: bottom;\n    font-size: 50px;\n    animation-name: ', ';\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import { css, keyframes } from 'emotion';

var rotate = null;
var styles = void 0;

var Loading = function Loading() {
  return React.createElement(
    'div',
    { className: styles.wrap },
    React.createElement(
      'span',
      { className: styles.peace, role: 'img', 'aria-label': 'Peace Sign' },
      '\u270C'
    )
  );
};

rotate = keyframes(_templateObject);

styles = {
  wrap: css(_templateObject2),
  peace: css(_templateObject3, rotate)
};

export default Loading;