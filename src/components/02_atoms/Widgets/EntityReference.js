import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';

import api from './../../../utils/api/api';

class EntityReference extends React.Component {
  static propTypes = {
    ...WidgetPropTypes,
    inputProps: PropTypes.shape({
      resourceIdentifer: PropTypes.string,
    }).isRequired,
  };

  state = {
    inputValue: '',
    selectedItem: [],
    loading: true,
    placeholder: 'Loading...',
  };

  componentDidMount = () => {
    api('taxonomy_term', {
      parameters: {
        termType: 'recipe_category',
      },
    }).then(({ data: terms }) => {
      this.setState({
        loading: false,
        placeholder: '',
        suggestions: terms.map(({ attributes: { name: label } }) => ({
          label,
        })),
      });
    });
  };

  getSuggestions = inputValue => {
    let count = 0;

    return this.state.suggestions.filter(suggestion => {
      const keep =
        (!inputValue ||
          suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
            -1) &&
        count < 5;

      if (keep) {
        count += 1;
      }
      return keep;
    });
  };

  handleChange = item => {
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;
    if (
      selectedItem.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
    });
  };

  renderSuggestion = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  }) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion.label}
      </MenuItem>
    );
  };

  renderInput = ({ InputProps, ref, label, ...other }) => (
    <TextField
      label={label}
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );

  render() {
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className="container">
            {this.renderInput({
              fullWidth: true,
              label: this.props.label,
              InputProps: getInputProps({
                disabled: this.state.loading,
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className="chip"
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: this.state.placeholder,
                id: 'integration-downshift-multiple',
              }),
            })}
            {isOpen ? (
              <Paper className="paper" square>
                {this.getSuggestions(inputValue2).map((suggestion, index) =>
                  this.renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

export default EntityReference;
