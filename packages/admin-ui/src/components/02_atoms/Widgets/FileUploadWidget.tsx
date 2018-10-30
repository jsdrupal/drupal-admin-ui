import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import { css } from 'emotion';
import { Fragment } from 'react';
import * as React from 'react';
import styled from 'react-emotion';

// import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import api from '../../../utils/api/api';
import {
  deleteItemById,
  getItemsAsArray,
  setItemById,
} from '../../../utils/api/fieldItem';
import { File, FileUpload } from '../FileUpload/FileUpload';

const CardWrapper = styled('div')`
  margin-top: 15px;
`;

const Element = styled('div')`
  width: 100%;

  legend {
    margin-bottom: 10px;
  }

  .remove {
    margin-left: auto;
  }
`;

const Image = styled('div')`
  > img {
    max-width: 100px;
    margin-right: 20px;
  }
`;

const styles = {
  fullWidth: css`
    width: 100%;
  `,
};

interface SelectedItemType {}

interface FileProp {
  type: string,
  url: string,
  id: string,
  filename: string,
};

interface FileItemMultipleProp {
  id: string,
  file: FileProp,
};

interface FileItemSingleProp {
  file: FileProp,
};

interface Props {
  bundle: string,
  // TODO must lock this down
  classes: any,
  entityTypeId: string,
  fieldName: string,
  inputProps: {
    file_extensions: string,
    // TODO should this be number?
    max_filesize: string,
  },
  label: string,
  required: boolean,
  // TODO Must lock down.
  value: {
    data: {
     file: FileItemMultipleProp[] | FileItemSingleProp,
     meta: {
       alt: string,
     },
  }},
  schema: {
    properties:{
      data:{type: string}
    },
    maxItems: number,
  },
  onChange: ( {data }: {data: SelectedItemType} ) => void,
};

interface State {
  selectedItems: SelectedItemType[],
  inputProps?: {
    file_extensions: string,
    // TODO should this be number?
    max_filesize: string,
  },
  value?: {
    data: {
     file: FileItemMultipleProp[] | FileItemSingleProp,
     meta: {
       alt: string,
     },
  }},
};

class FileUploadWidget extends React.Component<Props, State> {

  public state = {
    selectedItems: [],
    inputProps: {
      file_extensions: 'png gif jpg jpeg',
      max_filesize: '2000000',
    },
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

  // TODO must lock down item type.
  public setSelectedItems = (items: any) => {
    this.setState(
      {
        selectedItems: items,
      },
      () => {
        this.props.onChange({
          data: this.state.selectedItems,
        });
      },
    );
  };

  public recalculateSelectedItems = () => {
    const entityTypeId = 'file';
    const bundle = 'file';

    const multiple = this.props.schema.properties.data.type === 'array';
    const items = getItemsAsArray(multiple, this.props.value.data);
    const ids = items.map(({ id }) => id);
    this.fetchEntitites(entityTypeId, bundle, ids).then(
      ({ data: entities }) => {
        this.setState({
          selectedItems: entities
            .map(({ id, attributes }: { id: string, attributes: string }, index: number) => ({
              id,
              type: 'file--file',
              [entityTypeId]: attributes,
              meta: items[index].meta,
            }))
            .reduce(
              // TODO must lock down paramter types
              // @ts-ignore
              (agg, item) => setItemById(multiple, item, agg),
              multiple ? [] : {},
            ),
        });
      },
    );
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
        bundle,
      },
    });

  public render() {
    const {
      value,
      label,
      bundle,
      fieldName,
      inputProps,
      entityTypeId,
      required,
      schema: { properties, maxItems },
      classes,
    } : Props = this.props;

    if (this.state.selectedItems === null) {
      return null;
    }

    // If array then allow for multiple uploads.
    const multiple = properties.data.type === 'array';

    const items = getItemsAsArray(multiple, this.state.selectedItems)
      // Default schema creates stub entries, which we don't need here.
      .filter(item => item.id);
    const length = (items && items.length) || 0;
    // maxItems is only set if array, so set to 1 as default.
    const maxItemsCount = multiple ? maxItems || 100000000000 : 1;

    return (
      <FormControl
        margin="normal"
        required={required}
        classes={classes}
        fullWidth={true}
      >
        <Element>
          <FormLabel component="legend">{label}</FormLabel>
          <div
            className={styles.fullWidth}
            style={{
              display:
                (!multiple && length) || length === maxItemsCount
                  ? 'none'
                  : 'block',
            }}
          >
            <FileUpload
              bundle={bundle}
              multiple={multiple}
              fieldName={fieldName}
              inputProps={inputProps}
              entityTypeId={entityTypeId}
              remainingUploads={maxItemsCount - length}
              onFileUpload={(files: File[]) => {
                const newItems = files.reduce((itemsAgg, file) => {
                  const item = {
                    file: {
                      type: 'file--file',
                      url: file.url[0].value,
                      id: file.uuid[0].value,
                      filename: file.filename[0].value,
                    },
                    meta: { alt: '' },
                    id: file.uuid[0].value,
                    type: 'file--file',
                  };
                  return setItemById(multiple, item, itemsAgg);
                }, items);

                this.setSelectedItems(newItems);
              }}
            />
          </div>

          {length > 0 && (
            <CardWrapper>
              <Card>
                <CardContent>
                  <List>
                    {items.map((item, index) => {
                      const {
                        id,
                        meta: { alt },
                        file: { url, filename },
                      } = item;
                      const last = items.length - 1 === index;

                      return (
                        <Fragment key={id}>
                          <ListItem>
                            <Image>
                              <img
                                alt={alt || filename}
                                src={`${
                                  process.env.REACT_APP_DRUPAL_BASE_URL
                                }${url}`}
                              />
                            </Image>
                            <TextField
                              required={true}
                              value={alt}
                              margin="normal"
                              label="Alternative text"
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                this.setSelectedItems(
                                  setItemById(
                                    multiple,
                                    {
                                      ...item,
                                      meta: {
                                        alt: event.target.value,
                                      },
                                    },
                                    value.data,
                                  ),
                                )
                              }
                            />
                            <Button
                              mini={true}
                              id={id}
                              variant="fab"
                              color="secondary"
                              className="remove"
                              aria-label="Remove Image"
                              onClick={event => {
                                this.setSelectedItems(
                                  deleteItemById(
                                    multiple,
                                    event.currentTarget.id,
                                    items,
                                  ),
                                );
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </ListItem>
                          {!last && <Divider />}
                        </Fragment>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </CardWrapper>
          )}
        </Element>
      </FormControl>
    );
  }
}

export default FileUploadWidget;
