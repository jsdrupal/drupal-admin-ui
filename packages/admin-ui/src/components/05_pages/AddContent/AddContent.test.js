import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';
import ListItemText from '@material-ui/core/ListItemText';

import AddContent from './AddContent';

describe('AddContent', () => {
  it('content types are requested on mount', () => {
    const requestContentTypes = jest.fn();

    shallow(
      <AddContent
        contentTypes={{}}
        requestContentTypes={requestContentTypes}
      />,
    );
    expect(requestContentTypes).toHaveBeenCalled();
  });

  it('content types shown', () => {
    const requestContentTypes = jest.fn();
    const mockContentTypes = {
      test1: {
        name: 'Test 1',
        description: 'Description 1',
      },
      test2: {
        name: 'Test 1',
        description: 'Description 1',
      },
    };

    const wrapper = mount(
      <MemoryRouter>
        <AddContent
          contentTypes={mockContentTypes}
          requestContentTypes={requestContentTypes}
        />
      </MemoryRouter>,
    );

    expect(wrapper.find(ListItemText).length).toBe(2);
  });
});
