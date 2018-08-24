import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';
import ReorderIcon from '@material-ui/icons/Reorder';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const Add = styled('div')`
  .icon {
    margin-left: 10px;
  }
`;

const style = {
  listItemStyles: {
    paddingLeft: 0,
  },
  ListItemIconStyles: {
    cursor: 'move',
  },
};

class MultipleFields extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    component: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  /**
   * Initial state
   */
  state = {
    currentIndex: -1,
    selectedValue: null,
  };

  componentDidMount() {
    const { value, onChange } = this.props;
    // Set the initial value to an empty string if no values in array.
    if (!value.length) {
      onChange(['']);
    }
  }

  /**
   * Sets the state value with the selected element.
   * @param {Event} event
   */
  onDragStart = event => {
    // setData needed for FireFox, needs to setData to work
    event.dataTransfer.setData('text', '');
    event.dataTransfer.effectAllowed = 'move';
    const currentIndex = parseInt(event.currentTarget.dataset.key, 10);

    this.setState({
      currentIndex,
      selectedValue: this.props.value[currentIndex],
    });
  };

  /**
   * Changes the current value with the value that is under the
   * current value, and replace the over value with the current
   * value.
   * @param {Event} event
   */
  onDragOver = event => {
    event.preventDefault();
    const {
      props: { value },
      state: { currentIndex, selectedValue },
    } = this;

    const overIndex = parseInt(event.currentTarget.dataset.key, 10);
    if (currentIndex !== overIndex) {
      // Changes the two values with one another
      value[currentIndex] = value[overIndex];
      value[overIndex] = selectedValue;

      this.setState({
        currentIndex: overIndex,
      });
    }
  };

  /**
   * Will update the state and call the onChange method
   * once the element has been reordered.
   */
  onDragEnd = () => {
    const { value, onChange } = this.props;
    this.setState(
      {
        currentIndex: -1,
        selectedValue: null,
      },
      () => {
        onChange(value);
      },
    );
  };

  /**
   * Updated the current value of the input.
   * @param {Event} event
   * @param {String} value
   */
  changeItem = index => value => {
    const { value: propsValue, onChange } = this.props;
    const newValue = [...propsValue];
    newValue[index] = value;
    onChange(newValue);
  };

  /**
   * Adds another empty string to the current set of values.
   */
  addAnotherItem = () => {
    const { value, onChange } = this.props;
    const newValue = [...value, ''];
    onChange(newValue);
  };

  render = () => {
    const {
      onDragEnd,
      changeItem,
      onDragOver,
      onDragStart,
      addAnotherItem,
      props: { label, value: values, component, onChange },
    } = this;
    return (
      <FormControl margin="normal" fullWidth>
        <FormLabel component="legend">{label}</FormLabel>
        <List
          ref={element => {
            this.wrapper = element;
          }}
        >
          {values &&
            values.map((value, index) => (
              <ListItem
                draggable
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                data-key={index}
                onDragEnd={onDragEnd}
                style={style.listItem}
                onDragOver={onDragOver}
                onDragStart={onDragStart}
              >
                <ListItemIcon style={style.ListItemIconStyles}>
                  <ReorderIcon />
                </ListItemIcon>
                <ListItemText>
                  {React.createElement(component, {
                    ...this.props,
                    value,
                    label: '', // Enforce a hidden label
                    onChange: changeItem(index),
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
                      if (values.length > 1) {
                        values.splice(index, 1);
                        onChange(values);
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
              onClick={addAnotherItem}
              aria-label="Add another item"
            >
              Add another item
              <AddIcon />
            </Button>
          </Add>
        </List>
      </FormControl>
    );
  };
}

export default MultipleFields;
