import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { css } from 'emotion';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

let styles;

const BooleanCheckbox = props => {
  const { onChange, label, value } = props;

  return (
    <FormControlLabel
      id={`${props.fieldName}-label`}
      control={
        <CheckBox
          id={`${props.fieldName}-cb`}
          onChange={event => onChange(event.target.checked)}
          margin="normal"
          value={String(value)}
        />
      }
      label={label}
      classes={css`
        ${props.classes} ${styles.widgetRoot};
      `}
    />
  );
};

BooleanCheckbox.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.bool,
};

BooleanCheckbox.defaultProps = {
  value: false,
};

styles = {
  widgetRoot: css`
    align-items: center;
  `,
};

export default BooleanCheckbox;
