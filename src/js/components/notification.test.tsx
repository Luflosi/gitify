import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { Map } from 'immutable';
import { fireEvent, render } from '@testing-library/react';

const { shell } = require('electron');

import { NotificationItem, mapStateToProps } from './notification';
import { mockedSingleNotification } from '../__mocks__/mockedData';

describe('components/notification.js', () => {
  const notification = mockedSingleNotification;

  beforeEach(() => {
    spyOn(shell, 'openExternal');
  });

  it('should test the mapStateToProps method', () => {
    const state = {
      settings: Map({
        markOnClick: true,
      }),
    };

    const mappedProps = mapStateToProps(state);

    expect(mappedProps.markOnClick).toBeTruthy();
  });

  it('should render itself & its children', async () => {
    const props = {
      markNotification: jest.fn(),
      markOnClick: false,
      notification: notification,
      hostname: 'github.com',
    };

    const tree = TestRenderer.create(<NotificationItem {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should open a notification in the browser', () => {
    const props = {
      markNotification: jest.fn(),
      markOnClick: false,
      notification: notification,
      hostname: 'github.com',
    };

    const { getByRole } = render(<NotificationItem {...props} />);
    fireEvent.click(getByRole('main'));
    expect(shell.openExternal).toHaveBeenCalledTimes(1);
  });

  it('should mark a notification as read', () => {
    const props = {
      markNotification: jest.fn(),
      markOnClick: false,
      notification: notification,
      hostname: 'github.com',
    };

    const { getByRole } = render(<NotificationItem {...props} />);
    fireEvent.click(getByRole('button'));
    expect(props.markNotification).toHaveBeenCalledTimes(1);
  });

  it('should open a notification in browser & mark it as read', () => {
    const props = {
      markNotification: jest.fn(),
      markOnClick: true,
      notification: notification,
      hostname: 'github.com',
    };

    const { getByRole } = render(<NotificationItem {...props} />);
    fireEvent.click(getByRole('main'));
    expect(shell.openExternal).toHaveBeenCalledTimes(1);
    expect(props.markNotification).toHaveBeenCalledTimes(1);
  });
});
