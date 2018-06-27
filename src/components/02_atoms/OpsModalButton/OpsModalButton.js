import React from 'react';
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
 *
 * Custom Properties :-
 *   title, string to appear in the modal dialog.
 *   text, string to appear below the title.
 */
class OpsModalButton extends React.Component {
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
    const { title, text, ...buttonProps } = this.props;

    return (
      <IconButton {...buttonProps} onClick={this.handleClickOpen}>
        {this.props.children}
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted="keepMounted"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Delete
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </IconButton>
    );
  }
}

OpsModalButton.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default OpsModalButton;
