import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import api from './../../../utils/api/api';

const Element = styled('div')`
  border: 2px dashed grey;
  border-radius: 3px;
  padding: 80px;
  width: 100%;
  position: relative;
`;

const Text = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  text-align: center;

  .icon {
    margin-left: 10px;
  }
`;

const Error = styled('div')`
  color: red;

  > ul {
    > li {
      margin-bottom: 10px;
    }

    p {
      margin: 0;
    }
  }
`;

class FileUpload extends Component {
  static propTypes = {
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    inputProps: PropTypes.shape({
      multiple: PropTypes.bool,
      file_extensions: PropTypes.string,
      max_filesize: PropTypes.number,
    }).isRequired,
  };

  /**
   * Initial state
   */
  state = {
    total: 0,
    files: [],
    errors: [],
    filesLength: 0,
  };

  /**
   * Will set the border of the element to red and
   * drop effect on drag over.
   * @param {Event} event
   */
  onDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setBorder('red');
    event.dataTransfer.dropEffect = 'dragend';
  };

  /**
   * Resets the border on drag leave.
   * @param {Event} event
   */
  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setBorder();
  };

  /**
   * Will read the file/s that are dropped in the drop area.
   * @param {Event} event
   */
  onDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    this.readFile(event.dataTransfer.files);
  };

  /**
   * Will call the click event on the input to open the file explorer
   * to allow file/s to be selected.
   */
  onClick = () => {
    this.input.click();
  };

  /**
   * Sets the border of the element.
   * @param {String} [color="grey"] Color of the border.
   */
  setBorder = (color = 'grey') => {
    const { element } = this;
    if (element) {
      element.style.border = `2px dashed ${color}`;
    }
  };

  /**
   * Will get the selected file/s from the file explorer.
   * @param {Event} event
   */
  getFiles = event => {
    this.readFile(event.target.files);
  };

  /**
   * Uploads the file to the server, updates the total and files state.
   * @param {Object} file File to be uploaded.
   */
  uploadFile = file => {
    const reader = new window.FileReader();

    reader.onloadend = async ({ target: { readyState, result } }) => {
      if (readyState === window.FileReader.DONE) {
        const {
          resetState,
          props: { entityTypeId, bundle, fieldName, onFileUpload },
        } = this;
        const { buffer } = new Uint8Array(result);
        const token = await api('csrf_token');
        // Replace file name, some reason any space doesn't work
        // TODO: Find a way to fix this without changing the name
        const fileName = file.name.replace(/[,#!$^&*;{}=\-+`~()[\] ]/g, '_');

        // Upload the file to server
        const createdFile = await api('file:upload', {
          parameters: {
            bundle,
            fileName,
            fieldName,
            entityTypeId,
            body: buffer,
          },
          options: {
            headers: {
              'X-CSRF-Token': token,
            },
          },
        });

        this.setState(
          prevState => ({
            total: prevState.total + 1,
            files: [...prevState.files, createdFile],
          }),
          () => {
            onFileUpload(this.state.files);
            resetState();
          },
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * Checks the current file has met all the criteria before
   * being uploaded to the server. If not then will set the
   * error state and update the total.
   * Will check file size and extension.
   * @param {String} type file type.
   * @param {Number} size file size.
   * @param {String} name file name.
   */
  checkFile = ({ type, size, name }) => {
    /* eslint-disable camelcase */
    const errors = {};
    const extension = type.split('/')[1]; // <MIME_subtype>
    const {
      resetState,
      props: {
        inputProps: { max_filesize, file_extensions },
      },
    } = this;

    // Check file size
    if (size > max_filesize) {
      // TODO: Convert max_filesize to MB
      errors.size =
        'The file could not be saved because it exceeds 2 MB, the maximum allowed size for uploads.';
    }

    // Check file extension
    if (!file_extensions.includes(extension)) {
      errors.type = `The image file is invalid or the image type is not allowed. Allowed types: ${file_extensions}.`;
    }

    // Check if there are errors
    if (Object.keys(errors).length > 0) {
      errors.name = `The specified file ${name} could not be uploaded.`;

      // Set the state with error and update total
      this.setState(
        prevState => ({
          total: prevState.total + 1,
          errors: [...prevState.errors, errors],
        }),
        resetState,
      );
      return false;
    }

    return true;
    /* eslint-enable camelcase */
  };

  /**
   * Resets the state if all file/s have been uploaded.
   */
  resetState = () => {
    const { total, filesLength } = this.state;
    if (total === filesLength) {
      this.setState({ files: [], filesLength: 0, total: 0 });
    }
  };

  /**
   * Will read the file/s, check if multiple files can be uploaded,
   * check for errors, if no errors then upload the file.
   * @param {Object} files Selected files.
   */
  readFile = files => {
    const {
      setBorder,
      checkFile,
      uploadFile,
      props: {
        inputProps: { multiple },
      },
    } = this;

    this.setState({ filesLength: files.length, errors: [] });
    setBorder();

    if (multiple) {
      Object.keys(files).forEach(key => {
        const file = files[key];
        if (checkFile(file)) {
          uploadFile(file);
        }
      });
    }

    // If single file upload, upload the first file from the dropped files
    if (!multiple && checkFile(files[0])) {
      uploadFile(files[0]);
    }
  };

  render = () => {
    const {
      onDrop,
      onClick,
      getFiles,
      onDragOver,
      onDragLeave,
      state: { errors },
      props: {
        inputProps: { multiple },
      },
    } = this;

    return (
      <Card>
        <CardContent>
          <Element
            onDrop={onDrop}
            onClick={onClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            innerRef={element => {
              this.element = element;
            }}
          >
            <Text>
              <p>
                {multiple
                  ? 'Drop files or click here to upload.'
                  : 'Drop a file or click here to upload.'}
              </p>
              <Button
                size="small"
                color="primary"
                variant="contained"
                aria-label="Upload Image/s"
              >
                Upload <CloudUploadIcon className="icon" />
              </Button>
            </Text>

            <input
              type="file"
              onChange={getFiles}
              multiple={multiple}
              style={{ display: 'none' }}
              ref={element => {
                this.input = element;
              }}
            />
          </Element>

          {errors.length > 0 && (
            <Error>
              <p>One or more files could not be uploaded.</p>
              <ul>
                {errors.map(({ name, size, type }) => (
                  <li>
                    {name}
                    <ul>
                      {size && <li>{size}</li>}
                      {type && <li>{type}</li>}
                    </ul>
                  </li>
                ))}
              </ul>
            </Error>
          )}
        </CardContent>
      </Card>
    );
  };
}

export default FileUpload;
