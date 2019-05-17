import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { colors, formColors } from '../../../Utils/colors';

const styles = {
  radio: css`
    appearance: none;
    border: 1px solid ${formColors.colorInputBorder};
    width: 18px;
    height: 18px;
    background-color: ${formColors.colorInputBg};
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto auto;
    border-radius: 50%;
    box-shadow: 0 0 0 4px transparent;
    box-sizing: border-box;
    margin: 0 10px 0 0;
    cursor: pointer;
    display: inline-block;
    vertical-align: text-top;
    &:hover {
      border-color: ${formColors.colorInputFg};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:focus {
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow};
      outline: none;
    }
    &:focus:hover {
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:checked {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='10' width='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23004ADC' /%3E%3C/svg%3E");
      border-color: ${formColors.colorInputBorderFocus};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderFocus};
    }
    &:checked:focus {
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:checked:hover {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='10' width='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23222330' /%3E%3C/svg%3E");
      border-color: ${formColors.colorInputFg};
    }
  `,
  radioWithError: css`
    border-color: ${formColors.colorInputBorderError};
    box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
    &:hover {
      border-color: ${formColors.colorInputFg};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:focus {
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:focus:hover {
      border-color: ${formColors.colorInputFg};
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:checked {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='10' width='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23D72222' /%3E%3C/svg%3E");
      border-color: ${formColors.colorInputBorderError};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:checked:focus {
      border-color: ${formColors.colorInputBorderError};
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:checked:hover {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='10' width='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23222330' /%3E%3C/svg%3E");
      box-shadow: inset 0 0 0 1px ${formColors.colorInputFg};
      border-color: ${formColors.colorInputFg};
    }
    &:checked:focus:hover {
      box-shadow: 0 0 0 1px ${formColors.colorInputBg},
        0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputFg};
      border-color: ${formColors.colorInputFg};
    }
  `,
  label: css`
    color: ${colors.text};
    cursor: pointer;
  `,
  labelRequired: css`
    :after {
      content: ' *';
      color: ${colors.maximumRed};
    }
  `,
};

/**
 * Renders an Input type radio.
 *
 * Example:
 *
 * @code
 * <InputRadio required />
 * @endcode
 */
const InputRadio = props => {
  const {
    checked,
    children,
    error,
    required,
    htmlAttributes,
    onChange,
  } = props;
  const labelClasses = [styles.label];
  const cbClasses = [styles.radio];
  if (required) {
    labelClasses.push(styles.labelRequired);
  }
  if (error) {
    cbClasses.push(styles.radioWithError);
  }

  const inputId = `${props.fieldName}-cb`;

  return (
    <label
      id={`${props.fieldName}-label`}
      htmlFor={inputId}
      className={css`
        ${labelClasses}
      `}
      {...htmlAttributes}
    >
      <input
        type="radio"
        id={inputId}
        defaultChecked={checked}
        name={props.fieldName}
        className={css`
          ${cbClasses}
        `}
        onChange={event => onChange(event.target.checked)}
      />
      {children}
    </label>
  );
};

InputRadio.propTypes = {
  checked: PropTypes.bool,

  /** Content contained within the label element. */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  /** true if the label relates to an element with an error. */
  error: PropTypes.bool,

  fieldName: PropTypes.string.isRequired,

  /** Any additional HTML properties to add to the label element. */
  htmlAttributes: PropTypes.objectOf([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),

  /** Content of the html "for" attribute to use for this label. */
  htmlFor: PropTypes.string.isRequired,

  onChange: PropTypes.func,

  /** True if this label relates to an element that is required. */
  required: PropTypes.bool,
};

InputRadio.defaultProps = {
  checked: false,
  error: false,
  htmlAttributes: {},
  onChange: () => {},
  required: false,
};

export default InputRadio;
