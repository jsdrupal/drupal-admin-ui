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
  schema: { default: defaultValue },
  classes,
  inputProps: { allowed_values: allowedValues },
}) => (
  <FormControl margin="normal" classes={classes}>
    <InputLabel htmlFor={fieldName} required={required}>
      {label}
    </InputLabel>
    <NativeSelect
      value={value || defaultValue}
      fullWidth
      onChange={event => onChange(event.target.value)}
      inputProps={{
        name: fieldName,
        id: fieldName,
      }}
      className={styles.select}
    >
      {Object.entries(allowedValues).map(([machineName, humanName]) => (
        <option key={machineName} value={machineName}>
          {humanName}
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
  }).isRequired,
  inputProps: PropTypes.shape({
    allowed_values: PropTypes.object.isRequired,
  }).isRequired,
};

OptionsSelect.defaultProps = {
  value: '',
  helpText: '',
};

export default OptionsSelect;
