import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import api from './../../../utils/api/api';

const Element = styled('div')`
  border: ${props => (props.drag ? '2px dashed red' : '2px dashed grey')};
  border-radius: 3px;
  height: 150px;
`;

class FileUpload extends React.Component {
  static propTypes = {
    entityTypeId: PropTypes.string.isRequired,
    bundle: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    onFileUpload: PropTypes.func.isRequired,
  };

  state = {
    drag: false,
    file: null,
  };

  onDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      drag: true,
    });
    event.dataTransfer.dropEffect = 'dragend';
  };

  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      drag: false,
    });
  };

  onDrop = event => {
    event.stopPropagation();
    event.preventDefault();

    const { files } = event.dataTransfer;
    const reader = new window.FileReader();

    reader.onloadend = async ({ target: { readyState, result } }) => {
      if (readyState === window.FileReader.DONE) {
        const { buffer } = new Uint8Array(result);

        const token = await api('csrf_token');
        const createdFile = await api('file:upload', {
          parameters: {
            entityTypeId: this.props.entityTypeId,
            bundle: this.props.bundle,
            fieldName: this.props.fieldName,
            fileName: files[0].name,
            body: buffer,
          },
          options: {
            headers: {
              'X-CSRF-Token': token,
            },
          },
        });

        this.setState(
          {
            drag: false,
            file: createdFile,
          },
          () => this.props.onFileUpload(createdFile),
        );
      }
    };

    // @TODO Handle multipe file uploads
    reader.readAsArrayBuffer(files[0]);
  };

  render() {
    return (
      <Element
        drag={this.state.drag}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {(this.state.file &&
          this.state.file.filename &&
          this.state.file.filename[0].value) ||
          'Drop a file or click here to upload one.'}
      </Element>
    );
  }
}

export default FileUpload;
