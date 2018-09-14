import 'jest-plugin-console-matchers/setup';
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
    expect(() => {
      const inlineMessage = 'This is sample message';
      const message = shallow(<InlineMessage message={inlineMessage} />);
      return message.text();
    }).toThrowWarning();
  });
});
