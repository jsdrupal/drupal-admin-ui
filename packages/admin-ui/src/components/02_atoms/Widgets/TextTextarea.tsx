import * as React from 'react';
import { css } from 'emotion';
// react-rte does not support typescript.
// https://github.com/sstur/react-rte/issues/105
// @ts-ignore
import RichTextEditor from 'react-rte';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

import WidgetProp from '../../05_pages/NodeForm/WidgetProp';

let styles: {
  container: string,
  label: string,
};

interface Props extends WidgetProp {
  value: Array<{value: string}> | {value: string};
  required?: boolean;
}

const createValueFromString = (props: Props) =>
  RichTextEditor.createValueFromString(
    // @todo This should not be needed after https://github.com/jsdrupal/drupal-admin-ui/issues/195
    (Array.isArray(props.value) &&
      props.value.length &&
      props.value[0].value) ||
      // @ts-ignore
      props.value.value ||
      '',
    'html',
  );

 const extractValueString = (props: Props) =>
  (Array.isArray(props.value) &&
    props.value.length &&
    props.value[0].value) ||
  // @ts-ignore
  props.value.value ||
  '';

/**
 * Some basic wysiwyg editor based upon react-rte which is based upon draft.js.
 * This was designed to be as easiest as possible for the demo.
 *
 * On the longrun we might want to switch back to ckeditor.
 */
class TextTextarea extends React.Component<Props> {

  static defaultProps = {
    value: {
      value: '',
      format: 'basic_html',
    },
  };

  state = {
      value: createValueFromString(this.props),
      valueString: extractValueString(this.props),
    };

  componentDidUpdate = (prevProps: Props) => {
    if (
      // @ts-ignore
      this.props.value.value !== prevProps.value.value &&
      extractValueString(this.props) !== this.state.valueString
    ) {
      this.setState({
        value: createValueFromString(this.props),
      });
    }
  };

  onChange = (value: any ) => {
    const valueString = value.toString('html');
    this.setState({ value, valueString }, () => {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange({
        // @ts-ignore
        value: valueString,
        format: 'basic_html',
      });
    });
  };

  render() {
    return (
      <FormControl margin="normal" fullWidth={true} required={this.props.required}>
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

};

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
