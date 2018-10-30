import * as React from 'react';
// @ts-ignore
import { shallow } from 'enzyme';

import App from './App';

it('renders without crashing', () => {
  const root = shallow(<App />);
  root.unmount();
});
