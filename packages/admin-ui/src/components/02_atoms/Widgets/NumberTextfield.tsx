import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

interface Prop extends WidgetProp {
  label: string;
  classes?: object; // TODO must lock down.
  inputProps: {
    max: number,
    min: number,
    step: number,
    suffix: string,
    prefix: string,
    unsigned?: boolean,
  };
  value: number;
  required?: boolean;
}

const NumberTextfield = ({
  label,
  classes,
  value,
  onChange,
  fieldName,
  required,
  inputProps,
}: Prop) => (
  <TextField
    id={fieldName}
    value={value}
    fullWidth={true}
    // @ts-ignore
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
    InputProps={{
      ...inputProps,
      // @ts-ignore
      unsigned: inputProps.unsigned && inputProps.unsigned.toString(),
      endAdornment: inputProps.suffix && (
        <InputAdornment position="end">{inputProps.suffix}</InputAdornment>
      ),
      startAdornment: inputProps.prefix && (
        <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
      ),
    }}
    type="number"
    margin="normal"
    label={label}
    classes={classes}
    required={required}
  />
);

NumberTextfield.defaultProps = {
  classes: {},
  inputProps: {
    min: 0,
  },
  value: '',
};

export default NumberTextfield;
