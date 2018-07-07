import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import FileUpload from '../FileUpload/FileUpload';

const FileUploadWidget = props => (
  <FormControl>
    <FormLabel component="legend">{props.label}</FormLabel>
    <FileUpload
      bundle={props.bundle}
      entityTypeId={props.entityTypeId}
      fieldName={props.fieldName}
      onFileUpload={file => {
        props.onChange({
          data: {
            type: 'file--file',
            id: file.uuid[0].value,
          },
        });
      }}
    />
    {props.value && (
      <TextField
        value={(props.value.meta || {}).alt || ''}
        onChange={event =>
          props.onChange({
            ...props.value,
            meta: {
              ...(props.value.meta || {}),
              alt: event.target.value,
            },
          })
        }
        margin="normal"
        label="Alternative text"
        required
      />
    )}
  </FormControl>
);

FileUploadWidget.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.shape({
    data: PropTypes.shape({
      uuid: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
        }),
      ),
    }),
    meta: PropTypes.shape({
      alt: PropTypes.string,
    }),
  }),
};

FileUploadWidget.defaultProps = {
  value: null,
};

export default FileUploadWidget;
