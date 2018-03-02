import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import StaticRoutesRegistry from './StaticRoutesRegistry';

class App extends Component {
  render() {
    return (
      <Router>
        {StaticRoutesRegistry.routes.map(route => {
          return (<Route {...route} />);
        })}
      </Router>
    );
  }
}

export default App;
