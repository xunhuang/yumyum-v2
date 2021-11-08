import { Grid, Link as MaterialLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import React from 'react';

import CreditPopover from './CreditHover';
import { DataCreditWidget } from './DataCredit';
import { asDialogue } from './FooterDialog';

const useStyles = makeStyles((theme) => ({
  topContainer: {
    marginTop: "2vh",
    paddingBottom: "2vh",
  },
  footerLink: {
    textAlign: "center",
  },
  linkContainer: {
    padding: "1vh",
  },
  iconRoot: {
    textAlign: "center",
  },
  githubIcon: {
    color: "#00aeef",
    margin: "0 auto",
  },
  creditParagraph: {
    textAlign: "center",
    display: "block",
    padding: "1vh",
  },
}));

const Footer = () => {
  const classes = useStyles();

  const [openedPopoverId, setOpenedPopoverId] = React.useState<null | string>(
    null
  );
  const handleClose = () => {
    setOpenedPopoverId(null);
  };

  return (
    <Grid
      container
      className={classes.topContainer}
      justifyContent="space-evenly"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={12} sm={1} />
      <Grid item xs={12} sm={2}>
        <Grid container justifyContent="center" className={classes.iconRoot}>
          <Grid item xs={3} sm={6}>
            <MaterialLink
              href="https://github.com/xunhuang/covid-19"
              className={classes.githubIcon}
            >
              <GitHubIcon fontSize="large" />
            </MaterialLink>
          </Grid>
          <Grid item xs={3} sm={6}>
            <MaterialLink
              href="https://www.facebook.com/groups/890203761415663"
              className={classes.githubIcon}
            >
              <FacebookIcon fontSize="large" />
            </MaterialLink>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.creditParagraph}
        >
          This website is is 100% volunteer developed, open source and funded by
          user donations. Click{" "}
          <MaterialLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setOpenedPopoverId("cred-popover");
            }}
          >
            here for volunteers
          </MaterialLink>{" "}
          that made significant contributions.
        </Typography>
        {asDialogue(
          CreditPopover,
          "Special Thanks To",
          openedPopoverId === "cred-popover",
          handleClose
        )}
        {asDialogue(
          DataCreditWidget,
          "Data Credits",
          openedPopoverId === "data-cred",
          handleClose
        )}
      </Grid>
      <Grid item xs={12} sm={1} />
    </Grid>
  );
};

export { Footer };
