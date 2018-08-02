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

class EntityReferenceAutocomplete extends React.Component {
  static propTypes = {
    ...WidgetPropTypes,
    inputProps: PropTypes.shape({
      bundle: PropTypes.string,
      type: PropTypes.string,
    }),
  };

  static defaultProps = {
    inputProps: {},
  };

  state = {
    inputValue: '',
    selectedItems: {},
    suggestions: new Map(),
    loading: false,
  };

  handleChange = ({ id, label }) =>
    this.setState(
      ({ selectedItems }) => ({
        inputValue: '',
        selectedItems: {
          ...selectedItems,
          ...{
            [id]: {
              id,
              label,
              // Figure out a better way to handle this.
              type: (
                this.props.schema.properties.data.items ||
                this.props.schema.properties.data
              ).properties.type.enum[0],
            },
          },
        },
      }),
      () => {
        this.props.onChange(this.state.selectedItems);
      },
    );

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
          suggestions: new Map(
            items.map(({ id, attributes: { name: label } }) => [
              id,
              { id, label },
            ]),
          ),
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
      this.setState(
        {
          selectedItems: selectedItems.slice(0, selectedItems.length - 1),
        },
        () => this.props.onChange(this.state.selectedItems),
      );
    }
  };

  handleDelete = id => () => {
    this.setState(
      state => {
        const { selectedItems } = state;
        delete selectedItems[id];
        return { selectedItems };
      },
      () => this.props.onChange(this.state.selectedItems),
    );
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
    selectedItem: selectedItems,
  }) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = Object.keys(selectedItems).includes(suggestion.id);

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.id}
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
      // @todo Disable the browser built in autocompletion.
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
        itemToString={item => (item ? item.label : '')}
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
                startAdornment: Object.entries(selectedItems).map(
                  ([key, value]) => (
                    <Chip
                      key={key}
                      tabIndex={-1}
                      label={value.label}
                      className="chip"
                      onDelete={this.handleDelete(key)}
                    />
                  ),
                ),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: '',
                id: 'integration-downshift-multiple',
              }),
            })}
            {isOpen ? (
              <Paper className="paper" square>
                {!this.state.loading &&
                  Array.from(this.state.suggestions.values()).map(
                    (suggestion, index) =>
                      this.renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion }),
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

export default EntityReferenceAutocomplete;
