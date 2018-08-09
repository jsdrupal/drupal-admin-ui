import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const styles = {
  select: css`
    min-width: 182px;
  `,
};

const OptionsSelect = ({
  label,
  value,
  onChange,
  helpText,
  fieldName,
  required,
  schema: { enum: options, default: defaultValue },
}) => (
  <FormControl margin="normal">
    <InputLabel htmlFor={fieldName} required={required}>
      {label}
    </InputLabel>
    <NativeSelect
      value={value || defaultValue}
      onChange={event => onChange(event.target.value)}
      inputProps={{
        name: fieldName,
        id: fieldName,
      }}
      className={styles.select}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </NativeSelect>
    {helpText && <FormHelperText>{helpText}</FormHelperText>}
  </FormControl>
);

OptionsSelect.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.string,
  helpText: PropTypes.string,
  schema: PropTypes.shape({
    default: PropTypes.string.isRequired,
    enum: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

OptionsSelect.defaultProps = {
  value: '',
  helpText: '',
};

export default OptionsSelect;
