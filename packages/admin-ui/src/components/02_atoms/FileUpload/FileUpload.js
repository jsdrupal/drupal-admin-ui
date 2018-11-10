import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LinearProgress from '@material-ui/core/LinearProgress';
import api from '../../../utils/api/api';

const Container = styled('div')`
  width: 100%;
`;

const Element = styled('div')`
  border: 2px dashed grey;
  border-radius: 3px;
  display: flex;
  padding: 25px;
  width: 100%;

  > div {
    width: 100%;
  }
`;

const Text = styled('div')`
  margin: 0;
  text-align: center;
  .icon {
    margin-left: 10px;
  }
`;

const marginTopDense = {
  marginTop: '10px',
};

const marginTop = {
  marginTop: '20px',
};

const error = {
  color: 'red',
  paddingLeft: 0,
};

class FileUpload extends Component {
  static propTypes = {
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
    remainingUploads: PropTypes.number.isRequired,
    inputProps: PropTypes.shape({
      file_extensions: PropTypes.string,
      max_filesize: PropTypes.string,
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
    isDisabled: false,
  };

  /**
   * Will set the border of the element to red and
   * drop effect on drag over.
   * @param {Event} event
   */
  onDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setElementStyles('red');
    event.dataTransfer.dropEffect = 'dragend';
  };

  /**
   * Resets the border on drag leave.
   * @param {Event} event
   */
  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setElementStyles();
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
   * Sets the styles of the drop zone element.
   * Set the border and opacity.
   * @param {String} [color="grey"] Color of the border.
   */
  setElementStyles = (color = 'grey') => {
    const {
      element,
      state: { isDisabled },
    } = this;

    if (element) {
      element.style.border = `2px dashed ${color}`;
      element.style.opacity = `${isDisabled ? '0.3' : '1'}`;
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
  checkFile = ({ type, size, name, lastModified }) => {
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
    if (max_filesize && size > Number(max_filesize)) {
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
      errors.id = lastModified;

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
    const {
      setElementStyles,
      state: { total, filesLength },
    } = this;

    if (total === filesLength) {
      this.setState(
        { files: [], filesLength: 0, total: 0, isDisabled: false },
        setElementStyles,
      );
    }
  };

  /**
   * Will read the file/s, check if multiple files can be uploaded,
   * check for errors, if no errors then upload the file.
   * @param {Object} files Selected files.
   */
  readFile = files => {
    const {
      setElementStyles,
      checkFile,
      uploadFile,
      props: { multiple, remainingUploads },
    } = this;

    // Slice the files if more than the remaining uploads length
    const slicedFiles = Object.keys(files)
      .slice(0, remainingUploads)
      .reduce((obj, value) => {
        obj[value] = files[value];
        return obj;
      }, {});

    this.setState(
      {
        errors: [],
        isDisabled: true,
        filesLength: Object.keys(slicedFiles).length,
      },
      setElementStyles,
    );

    if (multiple) {
      Object.keys(slicedFiles).forEach(key => {
        const file = slicedFiles[key];
        if (checkFile(file)) {
          uploadFile(file);
        }
      });
    }

    // If single file upload, upload the first file from the dropped files
    if (!multiple && checkFile(slicedFiles[0])) {
      uploadFile(slicedFiles[0]);
    }
  };

  /**
   * If disabled, then prevent all file upload events.
   * @param {Function} fn Event function.
   */
  isEnabled = fn => {
    if (this.state.isDisabled) {
      return null;
    }

    return fn;
  };

  render = () => {
    const {
      onDrop,
      onClick,
      getFiles,
      isEnabled,
      onDragOver,
      onDragLeave,
      state: { total, errors, isDisabled, filesLength },
      props: { multiple, remainingUploads },
    } = this;

    return (
      <Container>
        <Element
          onDrop={isEnabled(onDrop)}
          onClick={isEnabled(onClick)}
          onDragOver={isEnabled(onDragOver)}
          onDragLeave={isEnabled(onDragLeave)}
          innerRef={element => {
            this.element = element;
          }}
        >
          <Text>
            <Typography variant="subtitle1">
              {multiple
                ? 'Drop files or click here to upload.'
                : 'Drop a file or click here to upload.'}
            </Typography>
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={isDisabled}
              aria-label="Upload Image/s"
              style={marginTop}
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

        {filesLength > 0 && (
          <LinearProgress
            style={marginTop}
            variant="determinate"
            value={(total / filesLength) * 100}
          />
        )}

        {remainingUploads <= 15 && (
          <Typography component="p" style={marginTopDense}>
            Remaining uploads: {remainingUploads}
          </Typography>
        )}

        {errors.length > 0 && (
          <div>
            <Typography style={error} component="p">
              One or more files could not be uploaded.
            </Typography>

            <Typography style={error} component="ul">
              {errors.map(({ name, size, type, id }) => (
                <Typography style={error} component="li" key={id}>
                  {name}
                  <Typography style={error} component="ul">
                    {size && (
                      <Typography style={error} component="li">
                        {size}
                      </Typography>
                    )}
                    {type && (
                      <Typography style={error} component="li">
                        {type}
                      </Typography>
                    )}
                  </Typography>
                </Typography>
              ))}
            </Typography>
          </div>
        )}
      </Container>
    );
  };
}

export default FileUpload;
