import { css } from 'emotion';
import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import { Action } from '../../../actions/action';

const styles = {
  dialogActionName: css`
    text-transform: lowercase;
  `,
  listItemText: css`
    list-style-type: disc;
    display: list-item;
  `,
};

interface Content {
  attributes: {
    nid: string,
    title: string,
  }
};

interface Props {
  action: string,
  actions: Action[],
  checked: boolean[],
  contentList: Content[],
  dialogVisibility: boolean,
  handleClose: () => void,
  executeAction: () => void,
};

const ConfirmationDialog = ({
  action,
  actions,
  checked,
  contentList,
  dialogVisibility,
  handleClose,
  executeAction,
} : Props) => {
  const actionLabel = actions
    .filter(({ attributes: { id } }) => id === action)
    .map(({ attributes: { label } }) => label)
    .shift();
  return (
    <Dialog
      open={dialogVisibility}
      TransitionComponent={props => <Slide direction="up" {...props} />}
      onClose={handleClose}
    >
      <DialogTitle>
        Are you sure you want to apply the &quot;
        <span className={styles.dialogActionName}>{actionLabel}</span>
        &quot; action to these content items?
      </DialogTitle>
      <DialogContent>
        <List>
          {contentList
            .filter(({ attributes: { nid } }) =>
              Object.keys(checked).includes(`${nid}`),
            )
            .map(({ attributes: { title, nid } }) => (
              <ListItem key={nid}>
                <ListItemText className={styles.listItemText}>
                  {`${title}`}
                </ListItemText>
              </ListItem>
            ))}
        </List>
        <Typography>This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            executeAction();
            handleClose();
          }}
          color="primary"
        >
          {actionLabel}
        </Button>
        <Button onClick={handleClose} color="primary">
          <p>Cancel</p>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
