import React from 'react';
import { shallow } from 'enzyme';
import InlineMessage from './InlineMessage';

describe('inline messages', () => {
  it('severity error', () => {
    const inlineMessage = 'This is sample message';
    const severity = 'MESSAGE_SEVERITY_ERROR';
    const message = shallow(
      <InlineMessage message={inlineMessage} messageSeverity={severity} />,
    );
    expect(message.text()).toEqual('This is sample message');
  });

  it('without severity', () => {
    global.console.error = jest.fn();
    const inlineMessage = 'This is sample message';
    const message = shallow(<InlineMessage message={inlineMessage} />);
    expect(global.console.error.mock.calls[0][0]).toMatch(
      new RegExp(
        '^Warning: Failed prop type: The prop `messageSeverity` is marked as required in `Message`, but its value is `undefined`',
      ),
    );
    expect(message.text()).toEqual('This is sample message');
  });
});
