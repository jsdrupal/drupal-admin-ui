import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Markup } from 'interweave';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PageTitle from '../../02_atoms/PageTitle';

const styles = {
  root: css`
    margin-bottom: 50px;
  `,
};

export default class extends Component {
  static propTypes = {
    contentTypes: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
    requestContentTypes: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.requestContentTypes();
  }
  render = () => (
    <div className={styles.root}>
      <PageTitle>Add content</PageTitle>
      <Paper>
        <List data-nightwatch="node-type-list">
          {Object.keys(this.props.contentTypes).map(contentType => (
            <ListItem
              button
              component={Link}
              to={`/node/add/${contentType}`}
              key={`node-add-${contentType}`}
            >
              <ListItemText
                primary={this.props.contentTypes[contentType].name}
                secondary={
                  <Markup
                    content={this.props.contentTypes[contentType].description}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}
