import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { formColors } from '../../../Utils/colors';

const styles = {
  text: css`
    border: 1px solid ${formColors.colorInputBorder};
    background: ${formColors.colorInputBg};
    color: ${formColors.colorInputText};
    border-radius: 2px;
    padding: 1em;
    font-size: 16px;
    box-shadow: inset 0 0 0 1px transparent;
    box-sizing: border-box;
    &:placeholder {
      color: ${formColors.colorInputPlaceholder};
    }
    &:hover {
      border-color: ${formColors.colorInputFg};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:focus {
      border-color: ${formColors.colorInputBorderFocus};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderFocus};
      outline: none;
    }
  `,
  textError: css`
    border-color: ${formColors.colorInputBorderError};
    box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
  `,
  textDisabled: css`
    color: ${formColors.colorInputBorderError};
    background-color: ${formColors.colorInputBgDisabled};
    &:hover {
      border-color: ${formColors.colorInputBorder};
      box-shadow: inset 0 0 0 1px transparent;
    }
  `,
};

/**
 * Renders an Input type text.
 *
 * Example:
 *
 * @code
 * <InputText required />
 * @endcode
 */
const InputText = props => {
  const { name, error, disabled, htmlAttributes } = props;
  const cbClasses = [styles.text];
  if (error) {
    cbClasses.push(styles.textError);
  }
  if (disabled) {
    cbClasses.push(styles.textDisabled);
  }

  return (
    <input
      id={`id-${name}`}
      name={props.fieldName}
      className={css`
        ${cbClasses}
      `}
      {...htmlAttributes}
    />
  );
};

InputText.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  htmlAttributes: PropTypes.objectOf([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

InputText.defaultProps = {
  type: 'text',
  error: false,
  disabled: false,
  required: false,
  htmlAttributes: {},
};

export default InputText;
