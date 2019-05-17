import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { colors, formColors } from '../../../Utils/colors';

const styles = {
  checkbox: css`
    appearance: none;
    border: 1px solid ${formColors.colorInputBorder};
    width: 18px;
    height: 18px;
    background: ${formColors.colorInputBg};
    border-radius: 2px;
    box-shadow: 0 0 0 4px transparent;
    box-sizing: border-box;
    &:focus {
      box-shadow: 0 0 0 4px ${formColors.colorInputFocusShadow};
      outline: none;
    }
    &:hover {
      border-color: ${formColors.colorInputFg};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:focus:hover {
      box-shadow: 0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputFg};
    }
    &:checked {
      background-color: ${formColors.colorInputBorderFocus};
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='10' viewBox='0 0 12 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.18182 6.96572L1.97655 4.64855L1.79545 4.45826L1.61436 4.64855L0.818904 5.48437L0.654878 5.65672L0.818904 5.82907L4.00072 9.17235L4.18182 9.36263L4.36291 9.17235L11.1811 2.00817L11.3451 1.83582L11.1811 1.66347L10.3856 .827651L10.2045 .637365L10.0234 .82765L4.18182 6.96572Z' fill='white' /%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border-color: ${formColors.colorInputBorderFocus};
    }
    &:checked:focus {
      border-color: ${formColors.colorInputBorderFocus};
      box-shadow: 0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputBorderFocus};
    }
    &:checked:hover {
      background-color: ${formColors.colorInputFg};
      border-color: ${formColors.colorInputFg};
    }
  `,
  checkboxWithError: css`
    background-color: ${formColors.colorInputBg};
    border-color: ${formColors.colorInputBorderError};
    box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
    &:hover {
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:focus:hover {
      box-shadow: 0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:checked {
      background-color: ${formColors.colorInputBorderError};
      border-color: ${formColors.colorInputBorderError};
    }
    &:checked:focus {
      border-color: ${formColors.colorInputBorderError};
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
    }
    &:checked:hover {
      box-shadow: inset 0 0 0 1px ${formColors.colorInputBorderError};
      background-color: ${formColors.colorInputBorderError};
      border-color: ${formColors.colorInputBorderError};
    }
    &:checked:focus:hover {
      box-shadow: 0 0 0 4px ${formColors.colorInputFocusShadow},
        inset 0 0 0 1px ${formColors.colorInputBorderError};
      border-color: ${formColors.colorInputBorderError};
    }
  `,
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
 * Renders an Input type checkbox.
 *
 * Example:
 *
 * @code
 * <InputCheckbox required={true}>Checkbox</InputCheckbox>
 * @endcode
 */
const InputCheckbox = props => {
  const {
    checked,
    children,
    error,
    required,
    htmlAttributes,
    onChange,
  } = props;
  const labelClasses = [styles.label];
  const cbClasses = [styles.checkbox];
  if (required) {
    labelClasses.push(styles.labelRequired);
  }
  if (error) {
    labelClasses.push(styles.labelWithError);
    cbClasses.push(styles.checkboxWithError);
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
        type="checkbox"
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

InputCheckbox.propTypes = {
  checked: PropTypes.bool,

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,

  error: PropTypes.bool,

  fieldName: PropTypes.string.isRequired,

  htmlAttributes: PropTypes.objectOf([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),

  onChange: PropTypes.func,

  required: PropTypes.bool,
};

InputCheckbox.defaultProps = {
  checked: false,
  error: false,
  htmlAttributes: {},
  onChange: () => {},
  required: false,
};

export default InputCheckbox;
