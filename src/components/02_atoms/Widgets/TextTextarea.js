import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import RichTextEditor from 'react-rte';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

let styles;

/**
 * Some basic wysiwyg editor based upon react-rte which is based upon draft.js.
 * This was designed to be as easiest as possible for the demo.
 *
 * On the longrun we might want to switch back to ckeditor.
 */
class TextTextarea extends React.Component {
  static propTypes = {
    ...WidgetPropTypes,
    value: PropTypes.oneOfType([
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
        }),
      ),
    ]),
  };

  static defaultProps = {
    value: {
      value: '',
      format: 'basic_html',
    },
  };

  state = {
    value: RichTextEditor.createValueFromString(
      // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
      (Array.isArray(this.props.value) &&
        this.props.value.length &&
        this.props.value[0].value) ||
        this.props.value.value ||
        '',
      'html',
    ),
  };

  onChange = value => {
    this.setState({ value }, () => {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange({
        value: value.toString('html'),
      });
    });
  };

  render() {
    return (
      <FormControl margin="normal" fullWidth required={this.props.required}>
        <FormLabel classes={{ root: styles.label }}>
          {this.props.label}
        </FormLabel>
        <RichTextEditor
          className={styles.container}
          value={this.state.value}
          onChange={this.onChange}
        />
      </FormControl>
    );
  }
}

styles = {
  container: css`
    .public-DraftEditor-content {
      min-height: 110px;
    }
  `,
  label: css`
    margin-bottom: 10px;
  `,
};

export default TextTextarea;
