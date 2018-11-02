import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import * as React from 'react';
import { Component } from 'react';
import styled from 'react-emotion';
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

export interface File {
  // Should these names be plural, eg urls
  url: Array<{value: string}>,
  uuid: Array<{value: string}>
  name: string,
  filename: Array<{value: string}>
};

interface Error {
  id?: string,
  name?: string,
  size?: string,
  type?: string,
};

interface Props {
  entityTypeId: string,
  bundle: string,
  fieldName: string,
  onFileUpload: (files: File[]) => void,
  multiple: boolean,
  remainingUploads: number,
  inputProps: {
    file_extensions: string,
    max_filesize: string,
  },
};

interface State {
  total: number,
  files: File[],
  errors?: Error[],
  filesLength: number,
  isDisabled: boolean,
};

export class FileUpload extends Component<Props, State> {

  /**
   * Initial state
   */
  public state = {
    total: 0,
    errors: [],
    files: [],
    filesLength: 0,
    isDisabled: false,
  };

  // TODO refactor -Must provide a sensible default?
  // @ts-ignore
  public input: HTMLInputElement = React.createRef();

  // @ts-ignore
  public element: HTMLElement =  React.createRef();

  /**
   * Will set the border of the element to red and
   * drop effect on drag over.
   * @param {Event} event
   */
  public onDragOver = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    this.setElementStyles('red');
    event.dataTransfer.dropEffect = 'dragend';
  };

  /**
   * Resets the border on drag leave.
   * @param {Event} event
   */
  public onDragLeave = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    this.setElementStyles();
  };

  /**
   * Will read the file/s that are dropped in the drop area.
   * @param {Event} event
   */
  public onDrop = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    this.readFile(event.dataTransfer.files);
  };

  /**
   * Will call the click event on the input to open the file explorer
   * to allow file/s to be selected.
   */
  public onClick = () => {
    this.input.click();
  };

  /**
   * Sets the styles of the drop zone element.
   * Set the border and opacity.
   * @param {String} [color="grey"] Color of the border.
   */
  public setElementStyles = (color = 'grey') => {
    // TODO refactor must find a better way.
    // @ts-ignore
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
  public getFiles = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    // TODO refactor -Must provide correct event type that know about files.
    // @ts-ignore
    this.readFile(event.target.files);
  };

  /**
   * Uploads the file to the server, updates the total and files state.
   * @param {Object} file File to be uploaded.
   */
  public uploadFile = (file: File) => {
    // TODO window is a unknown type?
    // @ts-ignore
    const reader = new window.FileReader();

    // TODO refactor must find a better way.
    // @ts-ignore
    reader.onloadend = async ({ target: { readyState, result } }: {target:{readyState: State}}) => {
      // TODO window is a unknown type?
      // @ts-ignore
      if (readyState === window.FileReader.DONE) {
        const {
          resetState,
          props: { entityTypeId, bundle, fieldName, onFileUpload },
        } = this;
        const { buffer } = new Uint8Array(result);
        // @ts-ignore
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
          (prevState: State) => {
            const prevFiles = prevState.files;
            return {
              total: prevState.total + 1,
              files: [...prevFiles, createdFile],
            };
          },
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
  public checkFile = ({ type, size, name, lastModified }: {type:string, size:number, name: string, lastModified: string}) => {
    /* eslint-disable camelcase */
    const error: Error = {};
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
      error.size =
        'The file could not be saved because it exceeds 2 MB, the maximum allowed size for uploads.';
    }

    // Check file extension
    if (!file_extensions.includes(extension)) {
      error.type = `The image file is invalid or the image type is not allowed. Allowed types: ${file_extensions}.`;
    }

    // Check if there are errors
    if (Object.keys(error).length > 0) {
      error.name = `The specified file ${name} could not be uploaded.`;
      error.id = lastModified;

      // Set the state with error and update total
      this.setState(
        (prevState: State) => {
          const prevErrors: Error[] = prevState.errors || [];
          return {
            total: prevState.total + 1,
            errors: [...prevErrors, error],
          }
        },
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
  public resetState = () => {
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
  public readFile = (files:  FileList) => {
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
  public isEnabled = (fn: any) => {
    if (this.state.isDisabled) {
      return null;
    }

    return fn;
  };

  public render = () => {
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
            // TODO refactor - There is a code smell with the initialization of
            // this.element
            // @ts-ignore
            ref={(element: RefObject<HTMLInputElement>): void => {
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
              {errors.map(({ name, size, type, id }: Error) => (
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
