import { css } from 'emotion';
import * as React from 'react';
import * as withSideEffect from 'react-side-effect';

import Typography from '@material-ui/core/Typography';

const styles = {
  title: css`
    margin: 10px 3px 40px;
  `,
};

interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = ({ children }: PageTitleProps) => (
  <Typography variant="h4" classes={{ root: styles.title }}>
    {children}
  </Typography>
);

const reducePropsToState = (propsList: PageTitleProps[]) => {
  const innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.children;
  }

  return null;
};

/**
 * Set the title of the page based on the children of PageTitle.
 *
 * @param  {(String|Array)} title
 *   Title may be an array if the number children is > 1
 */
const handleStateChangeOnClient = (title: string | string[]) => {
  document.title = (Array.isArray(title) ? title : [title])
    .map(e => (e && typeof e === 'string' ? e.trim() : ''))
    .join(' ');
};

export default withSideEffect(reducePropsToState, handleStateChangeOnClient)(
  PageTitle,
);
