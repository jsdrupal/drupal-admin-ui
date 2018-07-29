import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import WidgetPropTypes from '../../05_pages/NodeForm/WidgetPropTypes';
import FileUpload from '../FileUpload/FileUpload';

const Element = styled('div')`
  > div {
    width: 100%;
  }

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

const FileUploadWidget = ({
  value,
  label,
  bundle,
  onChange,
  fieldName,
  inputProps,
  entityTypeId,
}) => {
  const length = value && value.data && Object.keys(value.data).length;
  return (
    <FormControl>
      <Element>
        <FormLabel component="legend">{label}</FormLabel>
        <div
          style={{
            display: !inputProps.multiple && length ? 'none' : 'block',
          }}
        >
          <FileUpload
            bundle={bundle}
            fieldName={fieldName}
            inputProps={inputProps}
            entityTypeId={entityTypeId}
            onFileUpload={files => {
              const data = files.reduce((arr, file) => {
                arr[file.uuid[0].value] = {
                  file: {
                    type: 'file--file',
                    url: file.url[0].value,
                    id: file.uuid[0].value,
                    filename: file.filename[0].value,
                  },
                  meta: { alt: '' },
                };
                return arr;
              }, {});

              onChange({
                data: {
                  ...value.data,
                  ...data,
                },
              });
            }}
          />
        </div>

        {length > 0 && (
          <Card>
            <CardContent>
              <List>
                {Object.keys(value.data).map(key => {
                  const {
                    meta: { alt },
                    file: { url, filename },
                  } = value.data[key];

                  return (
                    <ListItem key={key}>
                      <Image>
                        <img
                          alt={alt || filename}
                          src={`${process.env.REACT_APP_DRUPAL_BASE_URL}${url}`}
                        />
                      </Image>
                      <TextField
                        required
                        value={alt}
                        margin="normal"
                        label="Alternative text"
                        onChange={event =>
                          onChange({
                            data: {
                              ...value.data,
                              [key]: {
                                ...value.data[key],
                                meta: {
                                  alt: event.target.value,
                                },
                              },
                            },
                          })
                        }
                      />
                      <Button
                        mini
                        variant="fab"
                        color="secondary"
                        className="remove"
                        aria-label="Remove Image"
                        id={key}
                        onClick={event => {
                          const {
                            data: { [event.currentTarget.id]: remove, ...data },
                          } = value;
                          onChange({
                            data,
                          });
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        )}
      </Element>
    </FormControl>
  );
};

FileUploadWidget.propTypes = {
  ...WidgetPropTypes,
  value: PropTypes.shape({
    data: PropTypes.shape({
      file: PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
      }),
    }),
    meta: PropTypes.shape({
      alt: PropTypes.string,
    }),
  }),
  inputProps: PropTypes.shape({
    multiple: PropTypes.bool,
    file_extensions: PropTypes.string,
    max_filesize: PropTypes.number,
  }),
};

FileUploadWidget.defaultProps = {
  value: {},
  inputProps: {
    multiple: true,
    file_extensions: 'png gif jpg jpeg',
    max_filesize: 2000000,
  },
};

export default FileUploadWidget;
