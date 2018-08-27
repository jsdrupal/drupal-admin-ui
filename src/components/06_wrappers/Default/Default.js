import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ViewListIcon from '@material-ui/icons/ViewList';
import BuildIcon from '@material-ui/icons/Build';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import ExtensionIcon from '@material-ui/icons/Extension';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import AssesmentIcon from '@material-ui/icons/Assessment';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Snackbar from '../../02_atoms/SnackbarMessage/SnackbarMessage';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import {
  requestMenu,
  closeDrawer,
  openDrawer,
  setMessage,
  clearMessage,
} from '../../../actions/application';

let styles;

const iconMap = {
  '/admin/content': <ViewListIcon />,
  '/admin/structure': <BuildIcon />,
  '/admin/appearance': <ColorLensIcon />,
  '/admin/modules': <ExtensionIcon />,
  '/admin/config': <SettingsIcon />,
  '/admin/people': <PeopleIcon />,
  '/admin/reports': <AssesmentIcon />,
  '/admin/help': <HelpIcon />,
};

class Default extends React.Component {
  componentDidMount() {
    this.props.requestMenu();
  }

  render = () => (
    <div className={styles.outerWrapper}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        classes={{
          paper: `${styles.drawerPaper} ${!this.props.drawerOpen &&
            styles.drawerPaperClose}`,
        }}
        open={this.props.drawerOpen}
      >
        <div className={styles.menuButtonWrapper}>
          {this.props.drawerOpen ? (
            <IconButton
              aria-label="close drawer"
              onClick={this.props.closeDrawer}
              className={styles.menuButton}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.openDrawer}
              className={styles.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}
        </div>
        <Divider />
        <List data-nightwatch="menu">
          {this.props.menuLinks.map(({ link: menuLink }) => (
            <ListItem
              key={menuLink.url.replace(/\//g, '-')}
              component="li"
              button
            >
              <Link to={menuLink.url} className={styles.menuLink} role="button">
                {iconMap[menuLink.url] ? (
                  <ListItemIcon>{iconMap[menuLink.url]}</ListItemIcon>
                ) : (
                  ''
                )}
                <ListItemText primary={menuLink.title} />
              </Link>
            </ListItem>
          ))}
        </List>
        {this.props.menuLinks.length ? <Divider /> : ''}
      </Drawer>

      <main className={styles.main} id={styles.main}>
        <ErrorBoundary>
          {this.props.children}
          {this.props.message && (
            <Snackbar
              {...this.props.message}
              onClose={() => this.props.clearMessage(this.props.message.key)}
            />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

styles = {
  menuLink: css`
    display: inherit;
    text-decoration: inherit;
  `,
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
    overflow-x: hidden;
    transition: none;
    width: 72px;
    transition: width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
  `,
};

Default.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.shape({
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    type: PropTypes.string,
    key: PropTypes.number,
    open: PropTypes.bool,
  }),
  menuLinks: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      }),
    }),
  ).isRequired,
  requestMenu: PropTypes.func.isRequired,
  openDrawer: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool,
};

Default.defaultProps = {
  message: null,
  drawerOpen: false,
};

const mapStateToProps = state => ({
  message: state.application.messages[0] || null,
  menuLinks: state.application.menuLinks || [],
  drawerOpen: state.application.drawerOpen,
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      requestMenu,
      openDrawer,
      closeDrawer,
      setMessage,
      clearMessage,
    },
  )(Default),
);
