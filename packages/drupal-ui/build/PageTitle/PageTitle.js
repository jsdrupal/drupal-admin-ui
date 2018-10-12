var _templateObject = _taggedTemplateLiteral(['\n    margin: 10px 3px 40px;\n  '], ['\n    margin: 10px 3px 40px;\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';
import { css } from 'emotion';

import Typography from '@material-ui/core/Typography';

var styles = {
  title: css(_templateObject)
};

var PageTitle = function PageTitle(_ref) {
  var children = _ref.children;
  return React.createElement(
    Typography,
    { variant: 'h4', classes: { root: styles.title } },
    children
  );
};

PageTitle.propTypes = {
  children: PropTypes.node.isRequired
};

var reducePropsToState = function reducePropsToState(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.children;
  }

  return null;
};

/**
 * Set the title of the page based on the children of PageTitle.
 *
 * @param  {(String|Array)} title
 *   Title may be an array if the number children is > 1
 */
var handleStateChangeOnClient = function handleStateChangeOnClient(title) {
  document.title = (Array.isArray(title) ? title : [title]).map(function (e) {
    return e && typeof e === 'string' ? e.trim() : '';
  }).join(' ');
};

export default withSideEffect(reducePropsToState, handleStateChangeOnClient)(PageTitle);