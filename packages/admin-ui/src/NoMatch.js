import { Component } from 'react';
import PropTypes from 'prop-types';

import routes from './routes';

const NoMatch = class NoMatch extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    // We want to redirect everything without a match back to Drupal.
    if (!Object.keys(routes).includes(this.props.location.pathname)) {
      window.location =
        process.env.REACT_APP_DRUPAL_BASE_URL + this.props.location.pathname;
    }
  }

  render() {
    return null;
  }
};

export default NoMatch;
