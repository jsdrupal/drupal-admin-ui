import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

interface Props extends WidgetProp {
  // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
  classes?: object; // TODO must lock down.
  value: string[] | string;
  autoFocus?: boolean;
  required?: boolean;
}

const StringTextfield = (props: Props) => (
  <TextField
    id={props.fieldName}
    value={
      (Array.isArray(props.value) && props.value.length && props.value[0]) ||
      props.value
    }
    // @ts-ignore
    onChange={event => props.onChange(event.target.value)}
    margin="normal"
    label={props.label}
    classes={props.classes}
    required={props.required}
    autoFocus={props.autoFocus}
    fullWidth={true}
  />
);

StringTextfield.defaultProps = {
  value: '',
  autoFocus: false,
};

export default StringTextfield;
