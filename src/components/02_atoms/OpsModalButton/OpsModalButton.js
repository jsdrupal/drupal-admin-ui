import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

/* A Drupal specific button, for use in the operations column of a table.
 *
 * Typically a Add, Edit or Delete icon can be provided as a child element
 * see for example  '@material-ui/icons/Add'
 *
 * When pressed a modal dialog slides up into view.
 */
class OpsModalButton extends React.Component {
  static propTypes = {
    /**
     * The dialog title.
     */
    title: PropTypes.string.isRequired,
    /**
     * The text below the dialog title.
     */
    text: PropTypes.string.isRequired,
    /**
     * The confirm button label.
     */
    confirmText: PropTypes.string.isRequired,
    /**
     * The cancel button label.
     */
    cancelText: PropTypes.string.isRequired,
    /**
     * Children of the button.
     */
    children: PropTypes.node.isRequired,
    /**
     * Called when the confirm button is pressed.
     */
    enterAction: PropTypes.func.isRequired,
  };
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    // Pass all props except those consumed here down into the button.
    const {
      title,
      text,
      cancelText,
      confirmText,
      enterAction,
      ...buttonProps
    } = this.props;

    return (
      <Fragment>
        <IconButton {...buttonProps} onClick={this.handleClickOpen}>
          {this.props.children}
        </IconButton>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          onClose={this.handleClose}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                enterAction();
                this.handleClose();
              }}
              color="primary"
            >
              {confirmText}
            </Button>
            <Button onClick={this.handleClose} color="primary">
              {cancelText}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default OpsModalButton;
