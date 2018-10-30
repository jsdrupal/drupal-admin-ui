import CheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { css } from 'emotion';
import * as React from 'react';
import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

let styles: {root: string};

interface Props extends WidgetProp{
  fieldName: string,
  label: string,
  // required: boolean,
  value?: string,
};

const BooleanCheckbox = (props: Props) => {
  const { fieldName, onChange, label, value} = props;

  return (
    <FormControlLabel
      id={`${fieldName}-label`}
      control={
        <CheckBox
          // @ts-ignore
          id={`${fieldName}-cb`}
          // @ts-ignore
          onChange={event => onChange(event.target.checked)}
          // margin="normal"
          value={String(value)}
          checked={value}
        />
      }
      label={label}
      classes={styles}
      // required={required}
    />
  );
};

BooleanCheckbox.defaultProps = {
  value: false,
};

styles = {
  root: css`
    align-items: center;
  `,
};

export default BooleanCheckbox;
