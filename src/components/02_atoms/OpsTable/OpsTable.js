import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import OpsModalDialog from './OpsModalDialog';
import OpsTableContext from './OpsTableContext';

class OpsTable extends React.Component {
  state = {
    cancelText: '',
    confirmText: '',
    enterAction: () => {},
    open: false,
    text: '',
    title: '',
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  openDialog = ({ cancelText, confirmText, enterAction, text, title }) => {
    this.setState({
      cancelText,
      confirmText,
      enterAction,
      open: true,
      text,
      title,
    });
  };

  render() {
    const {
      cancelText,
      confirmText,
      enterAction,
      open,
      text,
      title,
    } = this.state;
    return (
      <Fragment>
        <OpsModalDialog
          enterAction={enterAction}
          handleClose={this.handleClose}
          cancelText={cancelText}
          confirmText={confirmText}
          open={open}
          text={text}
          title={title}
        />
        <Table>
          <OpsTableContext.Provider
            value={{
              openDialog: this.openDialog,
            }}
          >
            {this.props.children}
          </OpsTableContext.Provider>
        </Table>
      </Fragment>
    );
  }
}

OpsTable.propTypes = {
  children: PropTypes.node.isRequired,
};
export default OpsTable;
