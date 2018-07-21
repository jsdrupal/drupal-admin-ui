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

class EntityReferenceAutocompleteWidget extends React.Component {
  static propTypes = {
    ...WidgetPropTypes,
    inputProps: PropTypes.shape({
      bundle: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  };

  state = {
    inputValue: '',
    selectedItems: [],
    suggestions: [],
    loading: false,
  };

  handleChange = item => {
    let { selectedItems } = this.state;

    selectedItems = Array.from(new Set(selectedItems).add(item));

    this.setState({
      inputValue: '',
      selectedItems,
    });
  };

  handleInputChange = event => {
    this.setState({ loading: true, inputValue: event.target.value }, () => {
      // @todo Move this call to the mounting component?
      const [
        entityTypeId,
        [bundle],
      ] = this.determineEntityTypeAndBundlesFromSchema(this.props.schema);
      this.fetchSuggestedEntities(
        entityTypeId,
        bundle,
        this.state.inputValue,
      ).then(({ data: items }) => {
        this.setState({
          loading: false,
          suggestions: items.map(({ attributes: { name: label } }) => ({
            label,
          })),
        });
      });
    });
  };

  fetchSuggestedEntities = (bundle, type, input) =>
    api(bundle, {
      queryString: {
        filter: {
          // @todo On the longrun fetch the label_key from the entity type
          //   definition.
          name: {
            condition: {
              path: 'name',
              operator: 'CONTAINS',
              value: input,
            },
          },
        },
      },
      parameters: {
        type,
      },
    });

  handleKeyDown = event => {
    const { inputValue, selectedItems } = this.state;
    if (
      selectedItems.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      this.setState({
        selectedItems: selectedItems.slice(0, selectedItems.length - 1),
      });
    }
  };

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItems = [...state.selectedItems];
      selectedItems.splice(selectedItems.indexOf(item), 1);
      return { selectedItems };
    });
  };

  determineEntityTypeAndBundlesFromSchema = schema => {
    // For some reason different entity references have different schema.
    const resourceNames = (
      schema.properties.data.items || schema.properties.data
    ).properties.type.enum;
    return resourceNames
      .map(name => name.split('--'))
      .reduce(
        ([, bundles = []], [entityTypeId, bundle]) => [
          entityTypeId,
          [...bundles, entityTypeId === bundle ? undefined : bundle],
        ],
        [],
      );
  };

  renderSuggestion = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  }) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').includes(suggestion.label);

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
    const { inputValue, selectedItems } = this.state;

    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItems}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          selectedItem,
          highlightedIndex,
        }) => (
          <div className="container">
            {this.renderInput({
              fullWidth: true,
              label: this.props.label,
              InputProps: getInputProps({
                disabled: this.state.loading,
                startAdornment: selectedItems.map(item => (
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
                placeholder: '',
                id: 'integration-downshift-multiple',
              }),
            })}
            {isOpen ? (
              <Paper className="paper" square>
                {!this.state.loading &&
                  this.state.suggestions.map((suggestion, index) =>
                    this.renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem,
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

export default EntityReferenceAutocompleteWidget;
