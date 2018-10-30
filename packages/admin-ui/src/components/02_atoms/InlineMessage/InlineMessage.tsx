import * as React from 'react';
import { css } from 'emotion';
import {
  MESSAGE_SEVERITY_ERROR,
  MESSAGE_SEVERITY_SUCCESS,
  MESSAGE_SEVERITY_INFO,
  MESSAGE_SEVERITY_WARNING,
} from '../../../constants/messages';

let styles : {
  message: string,
  success:string,
  error: string,
  info: string,
  warning: string,
};

let modifierClassMap: Map<string,string>;

interface Props {
  message: string,
  messageSeverity: string,
};

const Message = ({ message, messageSeverity }: Props) => (
  <div className={`${styles.message} ${modifierClassMap[messageSeverity]}`}>
    {message}
  </div>
);

styles = {
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

modifierClassMap = new Map([
  [MESSAGE_SEVERITY_ERROR, styles.error],
  [MESSAGE_SEVERITY_SUCCESS, styles.success],
  [MESSAGE_SEVERITY_WARNING, styles.warning],
  [MESSAGE_SEVERITY_INFO, styles.info]
  ]
);

export default Message;
