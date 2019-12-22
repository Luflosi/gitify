const { shell } = require('electron');

import * as React from 'react';
import { connect } from 'react-redux';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Octicon, { Check, getIconByName } from '@primer/octicons-react';
import styled from 'styled-components';

import { generateGitHubWebUrl } from '../utils/helpers';
import { markNotification } from '../actions';
import { Notification } from '../../types/github';
import { formatReason, getNotificationTypeIcon } from '../utils/github-api';

const Wrapper = styled.div`
  display: flex;
  margin: 0;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid ${props => props.theme.grayLight};

  &:hover {
    background-color: ${props => props.theme.grayLighter};
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 0 0.5rem;
  overflow: hidden;
`;

const Title = styled.h6`
  margin-bottom: 0.25rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1rem;
`;

const Details = styled.div`
  font-size: 0.75rem;
  text-transform: text-capitalize;
`;

const IconWrapper = styled.div`
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background: none;
  border: none;

  .octicon:hover {
    color: ${props => props.theme.success};
    cursor: pointer;
  }
`;

interface IProps {
  hostname: string;
  notification: Notification;
  markOnClick: boolean;
  markNotification: (id: string, hostname: string) => void;
}

export class NotificationItem extends React.Component<IProps, {}> {
  pressTitle() {
    this.openBrowser();

    if (this.props.markOnClick) {
      this.markAsRead();
    }
  }

  openBrowser() {
    const url = generateGitHubWebUrl(this.props.notification.subject.url);
    shell.openExternal(url);
  }

  markAsRead() {
    const { hostname, notification } = this.props;
    this.props.markNotification(notification.id, hostname);
  }

  render() {
    const { notification } = this.props;
    const reason = formatReason(notification.reason);
    const typeIcon = getNotificationTypeIcon(notification.subject.type);
    const updatedAt = formatDistanceToNow(parseISO(notification.updated_at), {
      addSuffix: true,
    });

    return (
      <Wrapper>
        <IconWrapper>
          <Octicon
            icon={getIconByName(typeIcon)}
            size={20}
            ariaLabel={notification.subject.type}
          />
        </IconWrapper>
        <Main onClick={() => this.pressTitle()} role="main">
          <Title>{notification.subject.title}</Title>

          <Details>
            <span title={reason.description}>{reason.type}</span> - Updated{' '}
            {updatedAt}
          </Details>
        </Main>
        <IconWrapper>
          <Button onClick={() => this.markAsRead()}>
            <Octicon icon={Check} size={20} ariaLabel="Mark as Read" />
          </Button>
        </IconWrapper>
      </Wrapper>
    );
  }
}

export function mapStateToProps(state) {
  return {
    markOnClick: state.settings.get('markOnClick'),
  };
}

export default connect(mapStateToProps, { markNotification })(NotificationItem);
