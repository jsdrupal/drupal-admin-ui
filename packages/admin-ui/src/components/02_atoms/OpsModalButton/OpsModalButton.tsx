import * as React from 'react';
import {Fragment} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

interface Props {
  className?: string,
  title: string,
  text: string,
  confirmText: string,
  cancelText: string,
  children: React.ReactNode,
  enterAction: () => any,
};

/* A Drupal specific button, for use in the operations column of a table.
 *
 * Typically a Add, Edit or Delete icon can be provided as a child element
 * see for example  '@material-ui/icons/Add'
 *
 * When pressed a modal dialog slides up into view.
 */
class OpsModalButton extends React.Component<Props> {

  public state = {
    open: false,
  };

  public handleClickOpen = () => {
    this.setState({ open: true });
  };

  public handleClose = () => {
    this.setState({ open: false });
  };

  public render() {
    // Pass all props except those consumed here down into the button.
    const {
      title,
      text,
      cancelText,
      confirmText,
      enterAction,
      ...buttonProps
    } : Props = this.props;

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
