import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';
import ReorderIcon from '@material-ui/icons/Reorder';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { createEntity } from '../../../utils/api/schema';
import SchemaPropType from '../../05_pages/NodeForm/SchemaPropType';

const Add = styled('div')`
  .icon {
    margin-left: 10px;
  }
`;

const style = {
  ListItemStyles: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  ListItemIconStyles: {
    cursor: 'move',
    margin: '0 0 0 16px',
  },
};

class MultipleFields extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    component: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    schema: SchemaPropType.isRequired,
  };

  /**
   * Initial state
   */
  state = {
    handle: null,
    currentIndex: -1,
    newItemAdded: false,
  };

  /**
   * Sets the state handle with the handle target.
   * @param {Event} event
   */
  onMouseDown = event => {
    this.setState({
      handle: event.currentTarget,
    });
  };

  /**
   * Sets the state value with the selected element.
   * @param {Event} event
   */
  onDragStart = event => {
    const {
      props: { value },
      state: { handle },
    } = this;

    // Don't allow dragging if not handle or only one item in props.value
    if (!event.target.contains(handle) || value.length === 1) {
      event.preventDefault();
      return;
    }
    // setData needed for FireFox, needs to setData to work
    event.dataTransfer.setData('text', '');
    event.dataTransfer.effectAllowed = 'move';
    const currentIndex = parseInt(event.currentTarget.dataset.key, 10);

    this.setState({
      currentIndex,
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
      state: { currentIndex },
    } = this;

    const overIndex = parseInt(event.currentTarget.dataset.key, 10);
    if (currentIndex !== overIndex) {
      const selectedValue = value[currentIndex];
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
        handle: null,
        currentIndex: -1,
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
    this.setState(
      {
        newItemAdded: true,
      },
      () => {
        onChange(newValue);
      },
    );
  };

  createEmptyItem() {
    return createEntity(this.props.schema.items);
  }

  render = () => {
    const {
      onDragEnd,
      changeItem,
      onDragOver,
      onDragLeave,
      onDragStart,
      onMouseDown,
      addAnotherItem,
      state: { newItemAdded },
      props: { label, value: values, component, onChange },
    } = this;

    // values && values.length is to validate the object is not null and not an empty array, respectively
    // the last `&& values` is to make sure after validation, it always return `values`  instead of `values.length`
    const usedValues = (values && values.length && values) || [
      this.createEmptyItem(),
    ];
    return (
      <FormControl margin="normal" fullWidth>
        <FormLabel component="legend">{label}</FormLabel>
        <List>
          {usedValues &&
            usedValues.map((value, index) => (
              <ListItem
                draggable
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                data-key={index}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDragStart={onDragStart}
                style={style.ListItemStyles}
              >
                <ListItemIcon
                  onMouseDown={onMouseDown}
                  style={style.ListItemIconStyles}
                >
                  <ReorderIcon />
                </ListItemIcon>
                <ListItemText>
                  {React.createElement(component, {
                    ...this.props,
                    value,
                    label: '', // Enforce a hidden label
                    onChange: changeItem(index),
                    autoFocus: newItemAdded && index + 1 === values.length,
                  })}
                </ListItemText>
                <Fragment>
                  <Fab
                    mini
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
                  </Fab>
                </Fragment>
              </ListItem>
            ))}
        </List>
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
      </FormControl>
    );
  };
}

export default MultipleFields;
