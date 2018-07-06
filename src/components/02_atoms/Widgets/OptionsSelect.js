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
  name,
  label,
  value,
  options,
  onChange,
  helpText,
  fieldName,
}) => (
  <FormControl>
    <InputLabel htmlFor={name}>{label}</InputLabel>
    <NativeSelect
      value={value}
      onChange={event => onChange(event.target.value)}
      inputProps={{
        name: fieldName,
        id: name,
      }}
      className={styles.select}
    >
      <option value="" />
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
  name: PropTypes.string,
  value: PropTypes.string,
  helpText: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
};

OptionsSelect.defaultProps = {
  name: '',
  value: '',
  helpText: '',
  options: [],
};

export default OptionsSelect;
