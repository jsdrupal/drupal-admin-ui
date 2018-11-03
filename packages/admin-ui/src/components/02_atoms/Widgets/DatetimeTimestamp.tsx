import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

interface Props extends WidgetProp {
  classes?: any;
  fieldName: string;
  value?: number;
  label: string;
  required: boolean;
}

const DatetimeTimestamp = ({
  classes,
  fieldName,
  label,
  value,
  onChange,
  required,
}: Props) => (
  <TextField
    id={fieldName}
    fullWidth={true}
    label={label}
    type="datetime-local"
    defaultValue={value ? new Date(value * 1000).toJSON().slice(0, 19) : ''}
    margin="normal"
    // @ts-ignore
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(+new Date(event.target.value) / 1000)}
    InputLabelProps={{
      shrink: true,
    }}
    // TODO: figure out type
    // @ts-ignore
    classes={classes}
    required={required}
  />
);

DatetimeTimestamp.defaultProps = {
  value: 0,
};

export default DatetimeTimestamp;
