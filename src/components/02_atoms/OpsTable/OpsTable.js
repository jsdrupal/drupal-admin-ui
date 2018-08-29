import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import OpsModalDialog from './OpsModalDialog';
import OpsTableContext from './OpsTableContext';

/**
 * Extends a Table element to allow a operations column which support a
 * OpsModalButton with the ability to open a Dialog element housed within the
 * OpsTable.
 *
 * The Ops table provides a OpsTableContext which holds the handlers for
 * controlling the state of the centralized Dialog.
 *
 * see
 *  ./OpsTableContext
 *  ./OpsModalButton
 * @material-ui/core/Table
 */
class OpsTable extends Table {
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
