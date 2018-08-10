import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';

const Add = styled('div')`
  .icon {
    margin-left: 10px;
  }
`;

class MultipleFields extends Component {
  static propTypes = {
    // TODO: Fix PropTypes for other options
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    isMultiple: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  componentDidMount() {
    if (!this.props.value && this.props.isMultiple) {
      this.props.onChange(['']);
    }
  }

  addAnotherItem = () => {
    this.props.onChange([...this.props.value, '']);
  };

  render = () => {
    if (!this.props.isMultiple) {
      return React.cloneElement(this.props.children, {
        value: this.props.value,
        onChange: event => {
          this.props.onChange(event.target.value);
        },
      });
    }

    return (
      <div>
        <FormLabel component="legend">
          {this.props.children.props.label}
        </FormLabel>
        {this.props.value &&
          this.props.value.map((value, index) => (
            // TODO: fix index issue if possible
            <div key={index}>
              {React.cloneElement(this.props.children, {
                value,
                label: '',
                onChange: event => {
                  this.props.value[index] = event.target.value;
                  this.props.onChange(this.props.value);
                },
              })}
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
            </div>
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
      </div>
    );
  };
}

export default MultipleFields;
