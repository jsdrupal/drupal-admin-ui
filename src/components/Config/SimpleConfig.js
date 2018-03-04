import React from 'react';
import PropTypes from 'prop-types';
import configSchema from './../../configSchema.json';
import * as ConfigSchema from '../../lib/ConfigSchema';
import { fetchSimpleConfig } from '../../lib/ConfigSchema';

// @todo Replace it with react-json-schema-form?

/**
 * There are some major functions:
 *  - configSchemaToReactComponent: takes a config schema and output a react form for that
 *  - configSchemaToJsonSchema : Takes a config schema and converts it to a schema for the data stored in the config
 *  - configSchemaToUiSchema: Takes a config schema and enhances it with information like the widget.
 */

class SimpleConfig extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  onChangeField = (name) => (event) => {
    event.preventDefault();
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });
    fetchSimpleConfig(this.props.name)
      .then(config => {
        console.log(config);
        this.setState({
          ...config,
          loading: false,
        });
      });
  }

  render() {
    if (this.loading) {
      return (<div>Loading ...</div>);
    }
    return (
      <form>
        {ConfigSchema.configSchemaToReactComponent('', configSchema[this.props.name], this.onChangeField)}
        <button onClick={this.onSubmit}>Save</button>
      </form>
    );
  }

}

SimpleConfig.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

SimpleConfig.defaultProps = {
  onSubmit: () => {},
};

export default SimpleConfig;