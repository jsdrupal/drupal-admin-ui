import { Component } from 'react';
import { shape, string } from 'prop-types';

import routes from './routes';

const NoMatch = class NoMatch extends Component {
  static propTypes = {
    location: shape({
      pathname: string.isRequired,
    }).isRequired,
  };
  componentWillReceiveProps(nextProps) {
    if (!Object.keys(routes).includes(nextProps.location.pathname)) {
      window.location = window.location.href;
    }
  }
  render() {
    return null;
  }
};

export default NoMatch;
