import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

const TextArea = props => (
  <FormControl component="fieldset" margin="normal">
    <FormLabel component="legend">{props.label}</FormLabel>
    <CKEditor
      editor={ClassicEditor}
      data={props.value.value}
      onChange={ ( event, editor ) => {
        if (event.name === 'change:data') {
          props.onChange({
            value: editor.getData(),
            format: props.value.format || 'basic_html',
          });
        }
      }}
    />
  </FormControl>
);

TextArea.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.shape({
    value: PropTypes.string.isRequired,
    // @todo Add support for input formats.
    format: PropTypes.string,
  }),
};

TextArea.defaultProps = {
  value: {
    value: '',
  },
};

export default TextArea;
