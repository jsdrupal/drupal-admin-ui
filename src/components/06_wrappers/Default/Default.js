import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import CssBaseline from '@material-ui/core/CssBaseline';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import Menu from '../../04_organisms/Menu/Menu';

import Message from '../../02_atoms/Message/Message';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

let styles;

const Default = props => (
  <div className={styles.outerWrapper}>
    <CssBaseline />
    <Drawer variant="permanent" classes={{ paper: styles.drawerPaper }}>
      <Menu />
      <Divider />
    </Drawer>
    <main className={styles.main} id={styles.main}>
      <ErrorBoundary>
        {props.message && <Message {...props.message} />}
        {props.children}
      </ErrorBoundary>
    </main>
  </div>
);

styles = {
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
  `,
};

Default.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
};

Default.defaultProps = {
  message: null,
};

const mapStateToProps = state => ({
  message: state.application.message || null,
});

export default connect(mapStateToProps)(Default);
