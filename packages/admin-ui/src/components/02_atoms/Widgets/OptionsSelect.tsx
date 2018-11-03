import { css } from 'emotion';
import * as React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

const styles = {
  select: css`
    min-width: 182px;
  `,
};

interface Props extends WidgetProp {
  classes?: object; // TODO MUST lock down.
  label: string;
  value: string;
  helpText: string;
  schema: {
    default: string,
  };
  inputProps: {
    allowed_values: object,
  };
  required?: boolean;
}

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
}: Props) => (
  <FormControl margin="normal" classes={classes}>
    <InputLabel htmlFor={fieldName} required={required}>
      {label}
    </InputLabel>
    <NativeSelect
      value={value || defaultValue}
      fullWidth={true}
      // @ts-ignore
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



OptionsSelect.defaultProps = {
  value: '',
  helpText: '',
};

export default OptionsSelect;
