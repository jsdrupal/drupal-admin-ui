import React from 'react';
import { mount } from 'enzyme';

import ErrorBoundary from './ErrorBoundary';
import BannerMessage from '../../02_atoms/BannerMessage/BannerMessage';

describe('ErrorBoundary', () => {
  // Prevent errors from being printed in the test console output since we are
  // expecting to throw exceptions.
  // @see https://github.com/facebook/react/issues/11098
  beforeEach(() => {
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    global.console.error.mockRestore();
  });

  it('children are rendered if no exception is thrown', () => {
    const root = mount(<ErrorBoundary>Little kittens</ErrorBoundary>);
    expect(root.text()).toEqual('Little kittens');
  });

  it('error message is shown when exception is thrown in a child component', () => {
    const ComponentWithError = () => {
      throw new Error('Meow meow');
    };
    const root = mount(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>,
    );
    expect(root.find(BannerMessage).length).toEqual(1);
  });
});
