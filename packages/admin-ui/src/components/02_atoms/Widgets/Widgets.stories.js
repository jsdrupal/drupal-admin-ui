import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import figmaDecorator from 'storybook-addon-figma';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean, number, object, text } from '@storybook/addon-knobs/react';

import BooleanCheckbox from './BooleanCheckbox';
import DatetimeTimestamp from './DatetimeTimestamp';
import EntityReferenceAutocomplete from './EntityReferenceAutocomplete';
import FileUploadWidget from './FileUploadWidget';
import NumberTextfield from './NumberTextfield';
import OptionsSelect from './OptionsSelect';
import StringTextfield from './StringTextfield';
import TextTextarea from './TextTextarea';

/**
 * There is a known issue with addWithJSX and action() calls.
 *
 *  https://github.com/storybooks/addon-jsx/issues/30
 *
 * To get both the logger to function while still pretty printing sample code
 * in the JSX tab a toSting() method must be provided.
 */
const onChangeAction = action('onChange');
onChangeAction.toString = () => "action('onChange')";

const item = i => {
  const id = `id-${i}`;
  return {
    id: { id },
    file: {
      type: 'file--file',
      url: `url-${i}`,
      id: { id },
    },
    meta: {
      alt: text(`alt-${i}`, `This is an alternative(${i}).`),
    },
  };
};

storiesOf('Widgets/BooleanCheckbox', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2061%3A2386',
    }),
  )
  .addWithJSX('Default', () => (
    <BooleanCheckbox
      fieldName="ControlOne"
      label={text('BooleanCheckbox: label', 'CheckBox')}
      onChange={onChangeAction}
    />
  ));

storiesOf('Widgets/DatetimeTimestamp', module).addWithJSX('Default', () => (
  <DatetimeTimestamp
    fieldName="EventStart"
    label={text('DateTimestamp: label', 'A Simple Label')}
    name="startTime"
    onChange={onChangeAction}
    required={boolean('DatetimeTimestamp: required', true)}
    value={number('DateTimestamp: value', 0)}
  />
));

storiesOf('Widgets/EntityReferenceAutocomplete', module).addWithJSX(
  'Default',
  () => (
    <EntityReferenceAutocomplete
      bundle="recipe"
      entityTypeId="node"
      fieldName="field_author"
      inputProps={object('EntityReferenceAutocomplete: inputProps', {
        handler: 'default:user',
        handler_settings: {
          auto_create: false,
          filter: {
            type: '_none',
          },
          include_anonymous: true,
          sort: {
            field: '_none',
          },
          target_bundles: null,
        },
        match_operator: 'CONTAINS',
        placeholder: '',
        size: 60,
      })}
      label="Author"
      onChange={onChangeAction}
      required={false}
      schema={object('EntityReferenceAutocomplete: schema', {
        properties: {
          data: {
            properties: {
              id: {
                format: 'uuid',
                maxLength: 128,
                title: 'Resource ID',
                type: 'string',
              },
              type: {
                enum: ['user--user'],
                title: 'Referenced resource',
                type: 'string',
              },
              required: ['type', 'id'],
            },
            type: 'object',
          },
        },
        title: 'Author',
        type: 'object',
      })}
      value={object('EntityReferenceAutocomplete: data', {
        data: [
          {
            id: 'de67ff47-63de-4d00-9d8a-e39da7de6e95',
            label: 'admin',
            type: 'user--user',
          },
        ],
      })}
    />
  ),
);

storiesOf('Widgets/FileUploadWidget/Single File', module).addWithJSX(
  'Default',
  () => (
    <FileUploadWidget
      bundle="node"
      entityTypeId="Article"
      fieldName="image-file"
      label={text('FileUploadWidget: label(Single)', 'File to be uploaded')}
      onChange={onChangeAction}
      value={{
        data: item(1),
      }}
      schema={object('FileUploadWidget: schema(Single)', {
        properties: {
          data: {
            type: 'object',
          },
        },
      })}
    />
  ),
);

storiesOf('Widgets/FileUploadWidget/Multiple File', module).addWithJSX(
  'Default',
  () => (
    <FileUploadWidget
      bundle="node"
      entityTypeId="Article"
      fieldName="image-file"
      label={text('FileUploadWidget: label(Multiple)', 'Files to be uploaded')}
      onChange={onChangeAction}
      value={{
        data: {
          0: item(10),
          1: item(20),
          2: item(30),
        },
      }}
      schema={object('FileUploadWidget: schema(Multiple)', {
        maxItems: 10,
        properties: {
          data: {
            type: 'array',
          },
        },
      })}
    />
  ),
);

storiesOf('Widgets/NumberTextfield', module).addWithJSX('Default', () => (
  <NumberTextfield
    fieldName="textField"
    label={text('NumberTextfield: label', '0-9 in steps of 1')}
    inputProps={{
      min: number('min', 0),
      max: number('max', 9),
      step: number('step', 1),
      prefix: text('prefix', 'interger range'),
      suffix: text('suffix', ' for a storybook.'),
    }}
    onChange={onChangeAction}
    value={number('NumberTextfield: value', 5)}
  />
));

storiesOf('Widgets/OptionsSelect', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2061%3A1971',
    }),
  )
  .addWithJSX('Default', () => (
    <OptionsSelect
      helpText={text('OptionsSelect:helpText', 'Help text.')}
      fieldName="option"
      inputProps={object('OptionsSelect:inputProps', {
        allowed_values: {
          one: 'One',
          two: 'Two',
          three: 'Three',
          four: 'Four',
        },
        allowed_values_function: '',
      })}
      label={text('OptionsSelect:label', 'A Simple Label')}
      onChange={onChangeAction}
      schema={object('OptionsSelect: schema', {
        enum: ['One', 'Two', 'Three', 'Four'],
        default: 'Two',
      })}
      value={text('OptionsSelect: value', 'Entered text.')}
    />
  ));

storiesOf('Widgets/StringTextfield', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2057%3A1349',
    }),
  )
  .addWithJSX('Default', () => (
    <StringTextfield
      fieldName="userBio"
      label={text('StringTextfield: label', 'A Simple Label')}
      onChange={onChangeAction}
      value={text('StringTextfield: value', 'Entered text.')}
    />
  ));

storiesOf('Widgets/TextTextarea', module)
  .addDecorator(
    figmaDecorator({
      url:
        'https://www.figma.com/file/OqWgzAluHtsOd5uwm1lubFeH/Drupal-Design-system?node-id=2061%3A1805',
    }),
  )
  .addWithJSX('Default', () => (
    <TextTextarea
      fieldName="SummaryText"
      label={text('TextTextarea: label', 'A Simple wysiwyg editor')}
      name="summaryText"
      onChange={onChangeAction}
      value={object('TextTextarea: value', {
        value:
          'Lorem ipsum dolor sit amet, <b>consectetur adipiscing elit</b>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      })}
    />
  ));
