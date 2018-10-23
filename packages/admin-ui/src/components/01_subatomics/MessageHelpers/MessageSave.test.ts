import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';

import MessageSave from './MessageSave';

describe('Verify Message', () => {
  it('on save', () => {
    const bundle = 'Article';
    const title = 'Thai green curry';
    const nid = 5;
    const message = mount(
      <MemoryRouter>
        <MessageSave bundle={bundle} title={title} nid={nid} />
      </MemoryRouter>,
    );
    expect(message.find('a').prop('href')).toEqual('/node/5');
    expect(message.find('a').text()).toEqual('Thai green curry');
    expect(message.find('p').text()).toEqual(
      'Article Thai green curry has been updated',
    );
  });
});
