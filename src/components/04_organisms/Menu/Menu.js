import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewListIcon from '@material-ui/icons/ViewList';
import BuildIcon from '@material-ui/icons/Build';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import ExtensionIcon from '@material-ui/icons/Extension';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import AssesmentIcon from '@material-ui/icons/Assessment';
import HelpIcon from '@material-ui/icons/Help';

import { requestMenu } from '../../../actions/application';

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

class Menu extends Component {
  componentWillMount() {
    this.props.requestMenu();
  }
  render = () => (
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
  );
}

Menu.propTypes = {
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

const mapStateToProps = state => ({
  menuLinks: state.application.menuLinks,
});

export default connect(
  mapStateToProps,
  {
    requestMenu,
  },
)(Menu);
