import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import SchemaPropType from '../../05_pages/NodeForm/SchemaPropType';

import api from '../../../utils/api/api';
import { getItemsAsArray } from '../../../utils/api/fieldItem';

const styles = {
  results: css`
    position: absolute;
    z-index: 900;
  `,
  fullWidth: css`
    width: 100%;
  `,
};

class EntityReferenceAutocomplete extends React.Component {
  static propTypes = {
    ...WidgetPropTypes,
    schema: SchemaPropType.isRequired,
    required: PropTypes.bool.isRequired,
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
    selectedItems: null,
    suggestions: new Map(),
  };

  componentDidMount() {
    if (
      !this.state.selectedItems &&
      this.props.value &&
      this.props.value.data
    ) {
      this.recalculateSelectedItems();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.value &&
      this.props.value.data &&
      prevProps.value.data !== this.props.value.data
    ) {
      this.recalculateSelectedItems();
    }
  }

  getMaxItems = () => {
    const {
      schema: { maxItems, properties },
    } = this.props;
    const multiple = properties.data.type === 'array';
    return multiple ? maxItems || 100000000000 : 1;
  };

  recalculateSelectedItems = () => {
    const [
      entityTypeId,
      [bundle],
    ] = this.determineEntityTypeAndBundlesFromSchema(this.props.schema);

    const multiple = this.props.schema.properties.data.type === 'array';
    const items = getItemsAsArray(multiple, this.props.value.data);
    const ids = items.map(({ id }) => id);
    this.fetchEntitites(entityTypeId, bundle, ids).then(
      ({ data: entities }) => {
        this.setState({
          selectedItems: entities.map(
            ({ id, attributes: { name: label } }) => ({
              id,
              label,
              type: (
                this.props.schema.properties.data.items ||
                this.props.schema.properties.data
              ).properties.type.enum[0],
            }),
          ),
        });
      },
    );
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
    if (
      this.state.selectedItems &&
      this.getMaxItems() === Object.keys(this.state.selectedItems).length
    ) {
      return;
    }

    this.setState({ inputValue: event.target.value }, () => {
      if (!this.state.inputValue.length) {
        return;
      }

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

  fetchEntitites = (entityTypeId, bundle, ids) =>
    api(entityTypeId, {
      queryString: {
        filter: {
          id: {
            condition: {
              operator: 'IN',
              path: 'uuid',
              value: ids,
            },
          },
        },
      },
      parameters: {
        type: bundle,
      },
    });

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
      selectedItems &&
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
    if (
      selectedItems &&
      this.getMaxItems() === Object.keys(selectedItems).length
    ) {
      return null;
    }

    const isHighlighted = highlightedIndex === index;
    const isSelected =
      selectedItems && Object.keys(selectedItems).includes(suggestion.id);

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
      id={InputProps.id}
      InputProps={{
        inputRef: ref,
        ...InputProps,
        inputProps: {
          autoComplete: 'off',
        },
      }}
      {...other}
    />
  );

  render() {
    const { inputValue, selectedItems } = this.state;
    const { fieldName } = this.props;
    return (
      <FormControl
        margin="normal"
        required={this.props.required}
        classes={this.props.classes}
        fullWidth
      >
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
            <div className={styles.fullWidth}>
              {this.renderInput({
                fullWidth: true,
                label: this.props.label,
                InputProps: getInputProps({
                  startAdornment: selectedItems
                    ? /* eslint-disable prettier/prettier */
                      Object.entries(selectedItems).map(([key, value]) => (
                        <Chip
                          key={key}
                          tabIndex={-1}
                          label={value.label}
                          className="chip"
                          onDelete={this.handleDelete(key)}
                        />
                      ))
                    : [],
                  /* eslint-enable prettier/prettier */
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: '',
                  id: fieldName,
                }),
              })}
              {isOpen ? (
                <Paper
                  className={`${styles.results} ${styles.fullWidth}`}
                  square
                >
                  {!!this.state.inputValue.length &&
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
      </FormControl>
    );
  }
}

export default EntityReferenceAutocomplete;
