import * as React from 'react';
// @ts-ignore
import { shallow } from 'enzyme';
import LoadingBar from 'react-redux-loading-bar';

import { Roles } from './Roles';

describe('Roles', () => {
  it('tasks are deployed correctly on mount on unmount', () => {
    const requestRoles = jest.fn();
    const cancelTask = jest.fn();
    const root = shallow(
      // @ts-ignore
      <Roles cancelTask={cancelTask} requestRoles={requestRoles} roles={null}/>,
    );
    expect(requestRoles).toHaveBeenCalled();
    expect(cancelTask).not.toHaveBeenCalled();

    // Ensure that task is cancelled on unmount.
    root.unmount();
    expect(cancelTask).toHaveBeenCalled();
  });

  it('loading animation is shown before roles have been loaded', () => {
    const root = shallow(
      // @ts-ignore
      <Roles cancelTask={() => {}} requestRoles={() => {}} roles={null} />,
    );
    expect(root.find(LoadingBar).length).toEqual(1);
  });
});
