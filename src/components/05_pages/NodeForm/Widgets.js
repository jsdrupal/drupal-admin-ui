import loadable from 'loadable-components';

const OptionsSelect = loadable(() =>
  import('../../02_atoms/Widgets/OptionsSelect'),
);
const NumberTextfield = loadable(() =>
  import('../../02_atoms/Widgets/NumberTextfield'),
);
const StringTextfield = loadable(() =>
  import('../../02_atoms/Widgets/StringTextfield'),
);
const BooleanCheckbox = loadable(() =>
  import('../../02_atoms/Widgets/BooleanCheckbox'),
);
const DatetimeTimestamp = loadable(() =>
  import('../../02_atoms/Widgets/DatetimeTimestamp'),
);
const FileUploadWidget = loadable(() =>
  import('../../02_atoms/Widgets/FileUploadWidget'),
);
const EntityReferenceAutocomplete = loadable(() =>
  import('../../02_atoms/Widgets/EntityReferenceAutocomplete'),
);
const TextTextarea = loadable(() =>
  import('../../02_atoms/Widgets/TextTextarea'),
);

// @todo How do we do extensibility from modules, maybe a build step?
const widgets = {
  options_select: {
    component: OptionsSelect,
  },
  number: {
    component: NumberTextfield,
  },
  string: {
    component: StringTextfield,
  },
  boolean_checkbox: {
    component: BooleanCheckbox,
  },
  datetime_timestamp: {
    component: DatetimeTimestamp,
  },
  image_image: {
    component: FileUploadWidget,
    multiple: true,
  },
  entity_reference_autocomplete: {
    component: EntityReferenceAutocomplete,
    multiple: true,
  },
  text_textarea: {
    component: TextTextarea,
  },
};

export default widgets;
