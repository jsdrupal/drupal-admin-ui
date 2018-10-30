import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  bundle: string,
  title: string,
  nid: string,
};

const MessageSave = ({ bundle, title, nid } : Props) => (
  <Fragment>
    <p>
      {bundle} <Link to={`/node/${nid}`}>{title}</Link> has been updated
    </p>
  </Fragment>
);

export default MessageSave;
