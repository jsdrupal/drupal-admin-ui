import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import Message from '../../02_atoms/Message/Message';
import Menu from '../../04_organisms/Menu/Menu';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import {
  closeDrawer,
  openDrawer,
} from '../../../actions/application';


let styles;

const Default = props => (
  <div className={styles.outerWrapper}>
    <CssBaseline />
      <Drawer
          variant="permanent"
          classes={{
              paper: `${styles.drawerPaper} ${!props.drawerOpen &&
              styles.drawerPaperClose}`,
          }}
          open={props.drawerOpen}
      >
      <Divider />
      <Menu />
      <Divider />
    </Drawer>
    <main className={styles.main} id={styles.main}>
      <ErrorBoundary>
        {props.messages.map(message => (
            <Message {...message} key={message.key} />
        ))}
        {props.children}
      </ErrorBoundary>
    </main>
  </div>
);

styles = {
  menuButton: css`
    margin: 8px 12px;
  `,
  menuButtonWrapper: css`
    display: flex;
    justify-content: flex-end;
  `,
  outerWrapper: css`
    height: 100%;
    display: flex;
  `,
  main: css`
    flex-grow: 1;
    padding: 2rem;
    height: 100%;
  `,
  drawerPaper: css`
    position: relative;
    width: 250px;
    transition: width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
  `,
  drawerPaperClose: css`
    overflow-x: 'hidden';
    transition: none;
    width: 72px;
    transition: width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
  `,
};

Default.propTypes = {
  children: PropTypes.node.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
};

Default.defaultProps = {
  messages: [],
  drawerOpen: false,
};

const mapStateToProps = state => ({
  messages: state.application.messages || [],
  drawerOpen: state.application.drawerOpen,
});

export default connect(
  mapStateToProps,
  {
    openDrawer,
    closeDrawer,
  },
)(Default);
