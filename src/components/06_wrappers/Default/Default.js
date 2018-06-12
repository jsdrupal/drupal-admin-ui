import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
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

import { requestMenu } from '../../../actions/application';
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
      <Drawer variant="permanent" classes={{ paper: styles.drawerPaper }}>
        <List>
          {this.props.menuLinks.map(({ link: menuLink }) => (
            <ListItem button component={Link} to={menuLink.url} key={menuLink.url.replace(/\//g, '-')}>
              {iconMap[menuLink.url] ? (
                <ListItemIcon>{iconMap[menuLink.url]}</ListItemIcon>
              ) : (
                ''
              )}
              <ListItemText primary={menuLink.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <main className={styles.main} id={styles.main}>
        <ErrorBoundary>
          {this.props.message && <Message {...this.props.message} />}
          {this.props.children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

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
  menuLinks: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      }),
    }),
  ).isRequired,
  requestMenu: PropTypes.func.isRequired,
};

Default.defaultProps = {
  message: null,
};

const mapStateToProps = state => ({
  message: state.application.message || null,
  menuLinks: state.application.menuLinks || [],
});

export default connect(mapStateToProps, {
  requestMenu,
})(Default);
