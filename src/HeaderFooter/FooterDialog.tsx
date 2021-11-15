import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    // right: theme.spacing(1),
    // top: theme.spacing(1),
    right: 1,
    top: 1,
    // color: theme.palette.grey[500],
  },
}));

type DialogTitleProp = {
  id: string;
  children: JSX.Element | string;
  onClose: () => void;
};

const DialogTitle = ({ id, children, onClose }: DialogTitleProp) => {
  const classes = useStyles();

  return (
    <MuiDialogTitle disableTypography className={classes.root} id={id}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const asDialogue = (
  Component: () => JSX.Element,
  title: string,
  open: boolean,
  handleClose: () => void,
  buttonText = false
) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>{Component()}</DialogContent>
      {buttonText ? (
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            {buttonText}
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};

export { asDialogue };
