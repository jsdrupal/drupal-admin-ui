import * as React from 'react';
import { css } from 'emotion';
import { MESSAGE_SEVERITY } from '../../../constants/messages';

const styles = {
  message: css`
    padding: 20px 25px;
    margin-bottom: 30px;
    color: #fff;
  `,
  success: css`
    background-color: #43a047;
  `,
  error: css`
    background-color: #d32f2f;
  `,
  info: css`
    background-color: #1976d2;
  `,
  warning: css`
    background-color: #ffa000;
  `,
};

const modifierClassMap: Map<MESSAGE_SEVERITY,string> = new Map([
  [MESSAGE_SEVERITY.ERROR, styles.error],
  [MESSAGE_SEVERITY.SUCCESS, styles.success],
  [MESSAGE_SEVERITY.WARNING, styles.warning],
  [MESSAGE_SEVERITY.INFO, styles.info]
  ]
);

interface Props {
  message: string,
  messageSeverity: MESSAGE_SEVERITY,
};

const Message = ({ message, messageSeverity }: Props) => (
  <div className={`${styles.message} ${modifierClassMap[messageSeverity]}`}>
    {message}
  </div>
);

export default Message;
