import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';

const OptionsButtons = ({
  label,
  value,
  onChange,
  helpText,
  fieldName,
  required,
  schema: { default: defaultValue },
  classes,
  inputProps: { allowed_values: allowedValues },
}) => {
  // @todo fetch the options automatically
  const options = {
    foo: 'Foo',
    bar: 'Bar',
  };
  return (
    <FormControl margin="normal" classes={classes}>
      <InputLabel htmlFor={fieldName} required={required}>
        {label}
      </InputLabel>
      <FormGroup row>
        {Object.entries(options).map(([key, checkboxLabel]) => (
          <FormControlLabel
            key={key}
            control={<Checkbox value="foo" />}
            onChange={e => {
              if (e.target.checked) {
                onChange(Array.from(new Set([...value, e.target.value])));
              } else {
                onChange(value.filter(option => option !== e.target.value));
              }
            }}
            label={checkboxLabel}
          />
        ))}
      </FormGroup>
      {helpText && <FormHelperText>{helpText}</FormHelperText>}
    </FormControl>
  );
};

export default OptionsButtons;
