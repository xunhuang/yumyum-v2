import { Link, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import DatePicker from './DatePicker';
import { SelectedDateState } from './SelectedDateState';

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
}));

export const AppHeaderSection = () => {
  const classes = useStyles();

  const [date, setDate] = useRecoilState(SelectedDateState);

  return (
    <FullDivPadded>
      <Toolbar className={classes.appBar}>
        <div className={classes.topleft}>
          <Link href={"https://yumyum.life"}>
            <Typography noWrap className={classes.appName} variant="h6">
              YumYum
            </Typography>
          </Link>
        </div>
        <div className={classes.expander} />
        <DatePicker
          defaultValue={dayjs(date)}
          onChange={(value, dateString) => {
            setDate(dateString);
          }}
        />
        <div className={classes.expander} />
        <div>
          <Link
            target="_blank"
            href={DONATION_URL}
            className={classes.donations}
          >
            Buy Us A Coffee
          </Link>
        </div>
      </Toolbar>
    </FullDivPadded>
  );
};
