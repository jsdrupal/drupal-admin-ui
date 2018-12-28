import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

import { api } from '@drupal/admin-ui-utilities';
import { WorkflowType } from './workflow';

class ModerationStateDefaultWidget extends React.Component {
  state = {
    loaded: false,
    workflow: null,
  };

  componentDidMount() {
    api('entity', {
      parameters: {
        entityType: 'workflow',
      },
      queryString: {
        // @todo pull this from the schema.
        filter: { condition: { path: 'id', value: 'default' } },
      },
    }).then(response => {
      if (response.data && response.data.length) {
        this.setState({
          loaded: true,
          workflow: new WorkflowType(response.data[0].attributes),
        });
      }
    });
  }

  render() {
    if (this.state.workflow) {
      const stateId =
        this.props.value ||
        this.state.workflow.getDefaultModerationState();

      return (
        <FormControl className={this.props.class}>
          <InputLabel htmlFor="select-multiple-checkbox">
            Change to
          </InputLabel>
          <Select
            value={stateId}
            input={
              <Input name={this.props.fieldName} id={this.props.fieldName} />
            }
            onChange={e => {
              this.props.onChange(e.target.value);
            }}
          >
            {this.state.workflow
              .getTransitionsForState(stateId)
              .map(transition => (
                <MenuItem key={transition.to().id} value={transition.to().id}>
                  {transition.to().label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      );
    }
    return null;
  }
}

export default ModerationStateDefaultWidget;
