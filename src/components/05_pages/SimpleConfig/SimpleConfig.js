import React from 'react';
import { connect } from 'react-redux';
import { LoadingBar } from 'react-redux-loading-bar';
import { string, func, object } from 'prop-types';
import configSchema from './../../../configSchema.json';
import * as ConfigSchema from '../../../lib/ConfigSchema';
import { clearMessage } from '../../../actions/application';
import {
  requestSimpleConfig,
  requestSimpleConfigPost,
} from '../../../actions/simpleConfig';
import { cancelTask } from '../../../actions/helpers';

// @todo Replace it with react-json-schema-form?
// @todo Add serverside validation support

/**
 * Wraps the ConfigSchema lib into a working statefull react component.
 *
 * @see src/lib/ConfigSchema.js
 */
class SimpleConfig extends React.Component {
  static propTypes = {
    name: string.isRequired,
    requestSimpleConfig: func.isRequired,
    requestSimpleConfigPost: func.isRequired,
    cancelTask: func.isRequired,
    clearMessage: func.isRequired,
    // @todo: We cannot know the shape of the config further as it is generic?
    config: object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    config: null,
  };

  state = {
    config: null,
  };

  componentDidMount() {
    this.props.requestSimpleConfig(this.props.name);
  }

  componentWillReceiveProps({ config }) {
    // @todo I tried to use getDerivedStateFromProps but that didn't get executed.
    this.setState({
      config,
    });
  }

  componentWillUnmount() {
    this.props.cancelTask();
  }

  onChangeField = path => event => {
    event.preventDefault();
    const { target: { value } } = event;
    this.setState(
      prevState => {
        ConfigSchema.objectSet(path.filter(id => id), prevState.config, value);
        return prevState;
      },
      () => {
        this.props.clearMessage();
      },
    );
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.requestSimpleConfigPost(this.props.name, this.state.config);
  };

  render() {
    if (!this.state.config) {
      return <LoadingBar />;
    }
    return (
      <form>
        {ConfigSchema.configSchemaToReactComponent(
          '',
          this.state.config,
          configSchema[this.props.name],
          this.onChangeField,
        )}
        <button onClick={this.onSubmit}>Save</button>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => {
  if (typeof state.application.config[props.name] !== 'undefined') {
    return { config: state.application.config[props.name] };
  }
  return {
    config: null,
  };
};

export default connect(mapStateToProps, {
  requestSimpleConfig,
  requestSimpleConfigPost,
  cancelTask,
  clearMessage,
})(SimpleConfig);
