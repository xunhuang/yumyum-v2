import { Link, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { LastUpdatedState } from '../RecoilState';
import { SocialMediaButtons } from './SocialMedia';

export const FullDivPadded = styled.div`
  margin: 3px;
`;

const DONATION_URL = "https://ko-fi.com/covid19direct";

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: "flex",
  },
  appName: {
    overflow: "visible",
  },
  topleft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "self-start",
  },
  donations: {
    background: "#00aeef",
    color: "white",
    borderRadius: "15px",
    display: "block",
    marginLeft: "16px",
    padding: "6px 8px",
    textAlign: "center",
    "&:hover": {
      // color: theme.palette.primary.light,
      textDecoration: "none",
      transform: "translateY(-1px)",
    },
  },
  expander: {
    flexGrow: 1,
  },
  socialButtons: {
    fontSize: "1.5625em",
    lineHeight: "1em",
    whiteSpace: "nowrap",
    "& > *": {
      marginRight: "4px",
      verticalAlign: "middle",
    },
  },
  socialButton: {
    "&:hover": {
      transform: "translateY(-1px)",
    },
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    flexShrink: 2,
    justifyContent: "flex-end",
    textAlign: "end",
  },
}));

export const AppHeaderSection = () => {
  const classes = useStyles();
  const lastUpdated = useRecoilValue(LastUpdatedState);

  return (
    <FullDivPadded>
      <Toolbar className={classes.appBar}>
        <div className={classes.topleft}>
          <Link href={"https://covid-19.direct"}>
            <Typography noWrap className={classes.appName} variant="h6">
              COVID-19.direct (v2)
            </Typography>
          </Link>

          <SocialMediaButtons
            buttonClassName={classes.socialButton}
            className={classes.socialButtons}
          />
          {lastUpdated && `Updated : ${moment(lastUpdated).format("lll")}`}
        </div>
        <div className={classes.expander} />
        {/* <div className={classes.actions}> */}
        <div>
          <Link
            target="_blank"
            href={DONATION_URL}
            className={classes.donations}
          >
            Buy Us A Coffee
          </Link>
          <Link href={"https://coviddatausa.com"}>v1 Site</Link>
        </div>
      </Toolbar>
    </FullDivPadded>
  );
};
