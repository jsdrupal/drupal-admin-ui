import React from 'react';
import { shallow } from 'enzyme';
import InlineMessage from './InlineMessage';

describe('inline messages', function () {
  it('severity error', function () {
    var inlineMessage = 'This is sample message';
    var severity = 'MESSAGE_SEVERITY_ERROR';
    var message = shallow(React.createElement(InlineMessage, { message: inlineMessage, messageSeverity: severity }));
    expect(message.text()).toEqual('This is sample message');
  });

  it('without severity', function () {
    global.console.error = jest.fn();
    var inlineMessage = 'This is sample message';
    var message = shallow(React.createElement(InlineMessage, { message: inlineMessage }));
    expect(global.console.error.mock.calls[0][0]).toMatch(new RegExp('^Warning: Failed prop type: The prop `messageSeverity` is marked as required in `Message`, but its value is `undefined`'));
    expect(message.text()).toEqual('This is sample message');
  });
});