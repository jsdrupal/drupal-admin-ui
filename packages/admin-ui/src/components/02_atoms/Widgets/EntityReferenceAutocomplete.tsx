import * as React from 'react';
import * as keycode from 'keycode';
import Downshift from 'downshift';
import { css } from 'emotion';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import WidgetProp from '../../05_pages/NodeForm/WidgetProp';
import SchemaProp from '../../05_pages/NodeForm/SchemaProp';

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

interface SelectedItem {
  label: string,
  id: string,
  type: any,
}

interface Props extends WidgetProp {
  classes: object, // TODO must lock down.
  inputProps?: any,
  required: boolean,
  schema: SchemaProp,
  value: {
    data: [],
  }
};

 interface State {
   label: string
   inputValue: string,
   selectedItems: SelectedItem[],
   // TODO must lock this down.
   suggestions: Map<any,any>
 };

class EntityReferenceAutocomplete extends React.Component<Props, State> {

  public static defaultProps = {
    inputProps: {},
  };

  public state = {
    inputValue: '',
    label: '',
    selectedItems: [],
    suggestions: new Map(),
  };

  public componentDidMount() {
    if (
      !this.state.selectedItems &&
      this.props.value &&
      this.props.value.data
    ) {
      this.recalculateSelectedItems();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      this.props.value &&
      this.props.value.data &&
      prevProps.value.data !== this.props.value.data
    ) {
      this.recalculateSelectedItems();
    }
  }

  public getMaxItems = () => {
    const {
      schema: { maxItems, properties },
    } = this.props;
    const multiple = properties.data.type === 'array';
    return multiple ? maxItems || 100000000000 : 1;
  };

  public recalculateSelectedItems = () => {
    const [
      entityTypeId,
      [bundle],
    ] = this.determineEntityTypeAndBundlesFromSchema(this.props.schema);

    const multiple = this.props.schema.properties.data.type === 'array';
    const items = getItemsAsArray(multiple, this.props.value.data);
    const ids = items.map(({ id }: {id: string}) => id);
    this.fetchEntitites(entityTypeId, bundle, ids).then(
      // @ts-ignore
      ({ data: entities }) => {
        this.setState({
          selectedItems: entities.map(
            ({ id, attributes: { name: label } }:{id: string, attributes:{name: string}}) => ({
              id,
              label,
              type: (
                this.props.schema.properties.data.items ||
                this.props.schema.properties.data
                // @ts-ignore
              ).properties.type.enum[0],
            }),
          ),
        });
      },
    );
  };

  public handleChange = ({ id, label }: SelectedItem) =>
    this.setState(
      ({ selectedItems }: State) => ({
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
              // TODO must fix data structure.
              // @ts-ignore
              ).properties.type.enum[0],
            },
          },
        },
      }),
      () => {
        // @ts-ignore
        this.props.onChange(this.state.selectedItems);
      },
    );

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      // @ts-ignore
      ).then(({ data: items }) => {
        this.setState({
          suggestions: new Map(
            items.map(({ id, attributes: { name: label } }: {id: string, attributes:{name: string}}) => [
              id,
              { id, label },
            ]),
          ),
        });
      });
    });
  };

  public fetchEntitites = (entityTypeId: string, bundle: string, ids: string[]) =>
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

  public fetchSuggestedEntities = (bundle: string, type: string, input: string) =>
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

  public handleKeyDown = (event: number) => {
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
        // @ts-ignore
        () => this.props.onChange(this.state.selectedItems),
      );
    }
  };

  public handleDelete = (id: string) => () => {
    this.setState(
      state => {
        const { selectedItems } = state;
        delete selectedItems[id];
        return { selectedItems };
      },
      // @ts-ignore
      () => this.props.onChange(this.state.selectedItems),
    );
  };

  public determineEntityTypeAndBundlesFromSchema = (schema: any) => {
    // For some reason different entity references have different schema.
    const resourceNames = (
      schema.properties.data.items || schema.properties.data
    ).properties.type.enum;
    return resourceNames
      .map((name:string) => name.split('--'))
      .reduce(
        ([, bundles = []], [entityTypeId, bundle]: any) => [
          entityTypeId,
          [...bundles, entityTypeId === bundle ? undefined : bundle],
        ],
        [],
      );
  };

  public renderSuggestion = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem: selectedItems,
  }: {
    suggestion: {label: string, id: string},
    index: number,
    itemProps: string,
    highlightedIndex: number,
    selectedItem: {selectedItems:SelectedItem[]},
  }) => {
    if (
      selectedItems &&
      this.getMaxItems() === Object.keys(selectedItems).length
    ) {
      return null;
    }

    const isHighlighted = highlightedIndex === index;

    const isSelected =
      // TODO must work out why this fails.
      // @ts-ignore
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
  // TODO after typescript work out if ref is ever used.
  public renderInput = ({ InputProps, ref, label, ...other }: {InputProps: any, ref?: React.RefObject<any>, label:string, fullWidth: boolean }) => (
    <TextField
      label={label}
      id={InputProps.id}
      InputProps={{
        // is a value for refs is ever supplied?
        inputRef: ref,
        ...InputProps,
        inputProps: {
          autoComplete: 'off',
        },
      }}
      {...other}
    />
  );

  public render() {
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
                  // TODO must fix
                  // @ts-ignore
                  startAdornment: selectedItems
                    ? /* eslint-disable prettier/prettier */
                      Object.entries(selectedItems).map(([key, value]) => (
                        <Chip
                          key={key}
                          tabIndex={-1}
                          // TODO Must resolve failure.
                          // @ts-ignore
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
              }
            )}
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
                          // TODO this failure look like a unresolved bug.
                          // @ts-ignore
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
