import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

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

import {
  requestMenu,
  closeDrawer,
  openDrawer,
} from '../../../actions/application';
import Message from '../../02_atoms/Message/Message';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

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
  componentWillMount() {
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
              button
              component={Link}
              to={menuLink.url}
              key={menuLink.url.replace(/\//g, '-')}
            >
              {iconMap[menuLink.url] ? (
                <ListItemIcon>{iconMap[menuLink.url]}</ListItemIcon>
              ) : (
                ''
              )}
              <ListItemText primary={menuLink.title} />
            </ListItem>
          ))}
        </List>
        {this.props.menuLinks.length ? <Divider /> : ''}
      </Drawer>

      <main className={styles.main} id={styles.main}>
        <ErrorBoundary>
          {this.props.messages.map(message => (
            <Message {...message} key={message.key} />
          ))}
          {this.props.children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

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
  drawerOpen: PropTypes.bool,
};

Default.defaultProps = {
  messages: [],
  drawerOpen: false,
};

const mapStateToProps = state => ({
  messages: state.application.messages || [],
  menuLinks: state.application.menuLinks || [],
  drawerOpen: state.application.drawerOpen,
});

export default connect(
  mapStateToProps,
  {
    requestMenu,
    openDrawer,
    closeDrawer,
  },
)(Default);
