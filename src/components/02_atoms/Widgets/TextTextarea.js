import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import RichTextEditor from 'react-rte';
import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

let styles;

/**
 * Some basic wysiwyg editor based upon react-rte which is based upon draft.js.
 * This was designed to be as easiest as possible for the demo.
 *
 * On the longrun we might want to switch back to ckeditor.
 */
class TextTextarea extends Component {
  static propTypes = {
    ...WidgetPropTypes,
    value: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      value: RichTextEditor.createValueFromString(
        (this.props.value && this.props.value.value) || '',
        'html',
      ),
    };
  }

  onChange = value => {
    this.setState({ value });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange({
        value: value.toString('html'),
      });
    }
  };

  render() {
    return (
      <RichTextEditor
        className={styles.container}
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}

styles = {
  container: css`
    .public-DraftEditor-content {
      min-height: 110px;
    }
  `,
};

TextTextarea.defaultProps = {
  value: {
    value: '',
    format: 'basic_html',
  },
};

export default TextTextarea;
