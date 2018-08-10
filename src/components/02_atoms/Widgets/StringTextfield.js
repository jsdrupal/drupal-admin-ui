import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import MultipleFields from '../MultipleFields/MultipleFields';

const StringTextfield = ({ value, schema, label, onChange }) => (
  <MultipleFields
    value={value}
    onChange={onChange}
    isMultiple={schema.type === 'array'}
  >
    <TextField margin="normal" value={value} label={label} />
  </MultipleFields>
);

StringTextfield.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

StringTextfield.defaultProps = {
  value: '',
};

export default StringTextfield;
