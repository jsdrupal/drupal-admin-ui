import React from 'react';
import { connect } from 'react-redux';
import { LoadingBar } from 'react-redux-loading-bar';
import { string, func, object } from 'prop-types';
import configSchema from './../../../configSchema.json';
import * as ConfigSchema from '../../../lib/ConfigSchema';
import api from '../../../utils/api/api';
import {
  clearMessage,
  MESSAGE_SUCCESS,
  setMessage,
} from '../../../actions/application';
import { requestSimpleConfig } from '../../../actions/simple_config';
import { cancelTask } from '../../../actions/helpers';

// @todo Replace it with react-json-schema-form?

/**
 * Wraps the ConfigSchema lib into a working statefull react component.
 *
 * @see src/lib/ConfigSchema.js
 */
class SimpleConfig extends React.Component {
  static propTypes = {
    name: string.isRequired,
    requestSimpleConfig: func.isRequired,
    cancelTask: func.isRequired,
    setMessage: func.isRequired,
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

  componentWillReceiveProps(nextProps) {
    // @todo I tried to use getDerivedStateFromProps but that didn't get executed.
    this.setState({
      config: nextProps.config,
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
    this.saveSimpleConfig(this.props.name, this.state.config);
  };

  saveSimpleConfig = async (name, config) => {
    const csrfToken = await api('csrf_token');

    return api(
      'simple_config',
      { $name: name },
      {
        body: JSON.stringify(config),
        headers: {
          'content-type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        method: 'PATCH',
      },
    ).then(() => {
      this.props.setMessage('Changes have been saved', MESSAGE_SUCCESS);
    });
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
  cancelTask,
  setMessage,
  clearMessage,
})(SimpleConfig);
