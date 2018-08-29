import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const styles = {
  dialogActionName: css`
    text-transform: lowercase;
  `,
  listItemText: css`
    list-style-type: disc;
    display: list-item;
  `,
};

const ConfirmationDialog = ({
  action,
  actions,
  checked,
  contentList,
  dialogVisibility,
  handleClose,
  executeAction,
}) => {
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

ConfirmationDialog.propTypes = {
  action: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  checked: PropTypes.objectOf(PropTypes.bool).isRequired,
  contentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  dialogVisibility: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  executeAction: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
