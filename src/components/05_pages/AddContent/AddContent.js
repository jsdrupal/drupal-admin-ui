import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { requestContentTypes } from '../../../actions/application';

const styles = {
  root: css`
    margin-bottom: 50px;
  `,
};

class AddContent extends Component {
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
      <Paper>
        <List>
          {Object.keys(this.props.contentTypes).map(contentType => (
            <ListItem button component={Link} to={`/node/add/${contentType}`}>
              <ListItemText
                primary={this.props.contentTypes[contentType].name}
                secondary={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.contentTypes[contentType].description,
                    }}
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

const mapStateToProps = state => ({
  contentTypes: state.application.contentTypes,
});

export default connect(mapStateToProps, { requestContentTypes })(AddContent);
