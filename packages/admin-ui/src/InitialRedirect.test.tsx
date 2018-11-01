import * as React from 'react';
// @ts-ignore
import { shallow } from 'enzyme';
import * Redirect from 'react-router-dom';

import InitialRedirect from './InitialRedirect';

it('redirect to homepage', () => {
  // @ts-ignore
  const redirect = shallow(<InitialRedirect location={{ search: '' }} />);
  expect(redirect.find(Redirect).prop('to')).toEqual('/');
});

it('redirect to specific page', () => {
  const redirect = shallow(
    // @ts-ignore
    <InitialRedirect location={{ search: '?q=admin/people/permissions' }} />,
  );
  expect(redirect.find(Redirect).prop('to')).toEqual(
    'admin/people/permissions',
  );
});
