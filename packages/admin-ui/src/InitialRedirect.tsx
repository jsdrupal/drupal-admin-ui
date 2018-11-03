import * as React from 'react';
import { Redirect } from "react-router-dom";
interface Props {
  location: {
    search: string,
  };
}

const InitialRedirect = ({location: {search}}: Props) => {
  // Allow Drupal redirects to determine the initial path.
  const searchString = search
    .replace('?q=', '')
    // trim slashes on the left.
    .replace(/^\//, '');
  if (searchString) {
    return <Redirect to={searchString} />;
  }
  return <Redirect to="/" />;
};

export default InitialRedirect;
