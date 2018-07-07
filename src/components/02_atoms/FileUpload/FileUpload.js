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
    this.setState({
      drag: true,
    });

    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'dragend';
  };

  onDragLeave = event => {
    this.setState({
      drag: false,
    });
    event.stopPropagation();
    event.preventDefault();
  };

  onDrop = event => {
    event.stopPropagation();
    event.preventDefault();

    const { files } = event.dataTransfer;
    const reader = new window.FileReader();
    const that = this;

    reader.onloadend = async ({ target: { readyState, result } }) => {
      if (readyState === window.FileReader.DONE) {
        const { buffer } = new Uint8Array(result);

        const token = await api('csrf_token');
        const createdFile = await api('file:upload', {
          parameters: {
            ...that.props,
            fileName: files[0].name,
          },
          options: {
            headers: {
              'X-CSRF-Token': token,
            },
            body: buffer,
          },
        });

        this.props.onFileUpload(createdFile);
        this.setState({
          drag: false,
          file: createdFile,
        });
      }
    };

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
        {this.state.file && this.state.file.filename[0].value}
      </Element>
    );
  }
}

export default FileUpload;
