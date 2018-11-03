import { Component } from 'react';

import routes from './routes';

interface Props {
  location: {
    pathname: string,
  };
}

class NoMatch extends Component<Props> {

  componentDidMount() {
    // We want to redirect everything without a match back to Drupal.
    if (!Object.keys(routes).includes(this.props.location.pathname)) {
      // @ts-ignore
      window.location =
        process.env.REACT_APP_DRUPAL_BASE_URL + this.props.location.pathname;
    }
  }

  render() {
    return null;
  }
};

export default NoMatch;
