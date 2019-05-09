import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { colors } from '../../Utils/colors';

const styles = {
  label: css`
    color: ${colors.text};
  `,
  labelRequired: css`
    :after {
      content: ' *';
      color: ${colors.maximumRed};
    }
  `,
  labelWithError: css`
    color: ${colors.maximumRed};
  `,
};

/**
 * Renders an HTML <label> element.
 *
 * Example:
 *
 * @code
 * <Label htmlFor="title" required={true}>Article title</Label>
 * @endcode
 */
const Label = ({ children, htmlFor, error, required, htmlAttributes }) => {
  const classes = [styles.label];
  if (required) {
    classes.push(styles.labelRequired);
  }
  if (error) {
    classes.push(styles.labelWithError);
  }

  return (
    <label
      htmlFor={htmlFor}
      className={css`
        ${classes}
      `}
      {...htmlAttributes}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  /** Content contained within the label element. */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  /** true if the label relates to an element with an error. */
  error: PropTypes.bool,

  /** Any additional HTML properties to add to the label element. */
  htmlAttributes: PropTypes.objectOf([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),

  /** Content of the html "for" attribute to use for this label. */
  htmlFor: PropTypes.string.isRequired,

  /** True if this label relates to an element that is required. */
  required: PropTypes.bool,
};

Label.defaultProps = {
  error: false,
  htmlAttributes: {},
  required: false,
};

export default Label;
