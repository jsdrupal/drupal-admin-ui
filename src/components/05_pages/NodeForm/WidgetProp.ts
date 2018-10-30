import * as React from 'react';

interface WidgetProp {
  fieldName: string,
  label: string,
  onChange: (event: React.ChangeEvent<HTMLElement>) => any,
};

export default WidgetProp;
