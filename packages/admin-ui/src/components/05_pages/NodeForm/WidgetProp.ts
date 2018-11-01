import * as React from 'react';

interface WidgetProp {
  fieldName: string,
  label: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any,
};

export default WidgetProp;
