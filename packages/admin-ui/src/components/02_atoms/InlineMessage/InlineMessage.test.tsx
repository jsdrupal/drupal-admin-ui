import * as React from 'react';
// @ts-ignore
import { shallow } from 'enzyme';
import InlineMessage from './InlineMessage';
import { MESSAGE_SEVERITY } from '../../../constants/message_severity';

describe('inline messages', () => {
  it('severity error', () => {
    const inlineMessage = 'This is sample message';
    const severity = MESSAGE_SEVERITY.ERROR;
    const message = shallow(
      <InlineMessage message={inlineMessage} messageSeverity={severity} />,
    );
    expect(message.text()).toEqual('This is sample message');
  });

  it('without severity', () => {
    global.console.error = jest.fn();
    const inlineMessage = 'This is sample message';
    // @ts-ignore
    const message = shallow(<InlineMessage message={inlineMessage} messageSeverity={MESSAGE_SEVERITY.INFO} />);
    // @ts-ignore
    expect(global.console.error.mock.calls[0][0]).toMatch(
      new RegExp(
        '^Warning: Failed prop type: The prop `messageSeverity` is marked as required in `Message`, but its value is `undefined`',
      ),
    );
    expect(message.text()).toEqual('This is sample message');
  });
});
