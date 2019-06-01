import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { css } from 'emotion';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';

import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import FileUpload from '../FileUpload/FileUpload';
import {
  deleteItemById,
  getItemsAsArray,
  setItemById,
} from '../../../utils/api/fieldItem';
import api from '../../../utils/api/api';

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

class FileUploadWidget extends React.Component {
  state = {
    selectedItems: null,
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

  setSelectedItems = items => {
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

  recalculateSelectedItems = () => {
    const entityTypeId = 'file';
    const bundle = 'file';

    const multiple = this.props.schema.properties.data.type === 'array';
    const items = getItemsAsArray(multiple, this.props.value.data);
    const ids = items.map(({ id }) => id);
    this.fetchEntitites(entityTypeId, bundle, ids).then(
      ({ data: entities }) => {
        this.setState({
          selectedItems: entities
            .map(({ id, attributes }, index) => ({
              id,
              type: 'file--file',
              [entityTypeId]: attributes,
              meta: items[index].meta,
            }))
            .reduce(
              (agg, item) => setItemById(multiple, item, agg),
              multiple ? [] : {},
            ),
        });
      },
    );
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
        bundle,
      },
    });

  render() {
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
    } = this.props;

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
        fullWidth
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
              onFileUpload={files => {
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
                              required
                              value={alt}
                              margin="normal"
                              label="Alternative text"
                              onChange={event =>
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
                            <Fab
                              mini
                              id={id}
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
                            </Fab>
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

const filePropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.string,
  filename: PropTypes.string.isRequired,
});

const fileItemMultiplePropType = PropTypes.shape({
  id: PropTypes.toString.isRequired,
  file: filePropType.isRequired,
});

const fileItemSinglePropType = PropTypes.shape({
  file: filePropType.isRequired,
});

FileUploadWidget.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.shape({
    data: PropTypes.shape({
      file: PropTypes.oneOfType([
        PropTypes.arrayOf(fileItemMultiplePropType),
        fileItemSinglePropType,
      ]),
      meta: PropTypes.shape({
        alt: PropTypes.string,
      }),
    }),
  }),
  inputProps: PropTypes.shape({
    file_extensions: PropTypes.string,
    max_filesize: PropTypes.string,
  }),
  schema: PropTypes.shape({
    maxItems: PropTypes.number,
    properties: PropTypes.shape({
      data: PropTypes.shape({
        type: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

FileUploadWidget.defaultProps = {
  value: { data: { file: {}, meta: {} } },
  inputProps: {
    file_extensions: 'png gif jpg jpeg',
    max_filesize: '2000000',
  },
};

export default FileUploadWidget;
