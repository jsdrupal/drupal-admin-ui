import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const Add = styled('div')`
  .icon {
    margin-left: 10px;
  }
`;

const listItemStyles = {
  paddingLeft: 0,
};

class MultipleFields extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    component: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { value, onChange } = this.props;
    if (!value.length) {
      onChange(['']);
    }
  }

  addAnotherItem = () => {
    const { value, onChange } = this.props;
    onChange([...value, '']);
  };

  changeItem = index => value => {
    const { value: propsValue, onChange } = this.props;
    const newValue = [...propsValue];
    newValue[index] = value;
    onChange(newValue);
  };

  render = () => (
    <FormControl margin="normal" fullWidth>
      <FormLabel component="legend">{this.props.label}</FormLabel>
      <List>
        {this.props.value &&
          this.props.value.map((value, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index} style={listItemStyles}>
              <ListItemText>
                {React.createElement(this.props.component, {
                  ...this.props,
                  value,
                  label: '', // Enforce a hidden label.
                  onChange: this.changeItem(index),
                })}
              </ListItemText>
              <ListItemSecondaryAction>
                <Button
                  mini
                  variant="fab"
                  color="secondary"
                  className="remove"
                  aria-label="Remove Image"
                  onClick={() => {
                    if (this.props.value.length > 1) {
                      this.props.value.splice(index, 1);
                      this.props.onChange(this.props.value);
                    }
                  }}
                >
                  <DeleteIcon />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        <Add>
          <Button
            color="primary"
            variant="contained"
            aria-label="Add another item"
            onClick={this.addAnotherItem}
          >
            Add another item
            <AddIcon />
          </Button>
        </Add>
      </List>
    </FormControl>
  );
}

export default MultipleFields;
