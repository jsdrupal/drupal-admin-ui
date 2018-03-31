import React from 'react';
import PropTypes from 'prop-types';
import configSchema from './../../../configSchema.json';
import * as ConfigSchema from '../../../lib/ConfigSchema';
import api from '../../../utils/api/api';

// @todo Replace it with react-json-schema-form?

/**
 * There are some major functions:
 *  - configSchemaToReactComponent: takes a config schema and output a react form for that
 *  - configSchemaToJsonSchema : Takes a config schema and converts it to a schema for the data stored in the config
 *  - configSchemaToUiSchema: Takes a config schema and enhances it with information like the widget.
 */

class SimpleConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      config: {},
    };
  }

  onChangeField = path => event => {
    event.preventDefault();
    const { target: { value } } = event;
    this.setState(prevState => {
      ConfigSchema.objectSet(path.filter(id => id), prevState.config, value);
      return prevState;
    });
  };

  onSubmit = event => {
    event.preventDefault();
    this.saveSimpleConfig(this.props.name, this.state.config);
  };

  saveSimpleConfig = (name, config) => {
    return api(
      'simple_config',
      { $name: name },
      {
        body: JSON.stringify({ data: config }),
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PATCH',
      },
    );
  };

  componentDidMount() {
    this.setState(
      {
        loading: true,
      },
      () => {
        api('simple_config', { $name: this.props.name }).then(config => {
          this.setState({
            config,
            loading: false,
          });
        });
      },
    );
  }

  render() {
    if (this.loading) {
      return <div>Loading ...</div>;
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

SimpleConfig.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SimpleConfig;
