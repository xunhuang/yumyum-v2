import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Select } from 'antd';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { setLastUserSelection } from '../USPage/CookieUserSelection';
import { MetroDefiniton } from '../USPage/metro_def';
import { MetroState, useMetro } from '../USPage/useMetro';
import { SearchInput } from '../USPage/YumSearch';
import DatePicker from './DatePicker';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from './SelectedDateState';

export const FullDivPadded = styled.div`
  margin: 3px;
`;
const { Option } = Select;

// const DONATION_URL = "https://ko-fi.com/covid19direct";

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
  // donations: {
  //   background: "#00aeef",
  //   color: "white",
  //   borderRadius: "15px",
  //   display: "block",
  //   marginLeft: "16px",
  //   padding: "6px 8px",
  //   textAlign: "center",
  //   "&:hover": {
  //     textDecoration: "none",
  //     transform: "translateY(-1px)",
  //   },
  // },
  expander: {
    flexGrow: 1,
  },
}));

const MetroSelect = () => {
  const history = useHistory();
  const [metro, setMetro] = useRecoilState(MetroState);
  const systemMetro = useMetro();
  const mymetro = metro || systemMetro;
  return (
    <Select
      defaultValue={mymetro}
      style={{ width: 120 }}
      onSelect={(value, option) => {
        setMetro(value);
        history.push(`/metro/${value}/list/all`);

        // setPartySize(parseInt(value.toString()));
        // setLastUserSelection({
        //   date: date,
        //   party_size: parseInt(value.toString()),
        //   timeOption: timeOption,
        // });
      }}
    >
      {MetroDefiniton.map((m) => (
        <Option key={m.key} value={m.key}>
          {m.name}
        </Option>
      ))}
    </Select>
  );
};

export const AppHeaderSection = () => {
  const classes = useStyles();

  const [date, setDate] = useRecoilState(SelectedDateState);
  const [party_size, setPartySize] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  return (
    <FullDivPadded>
      <Toolbar className={classes.appBar}>
        <div className={classes.topleft}>
          <Button
            type="primary"
            size="large"
            style={{
              background: "red",
              borderColor: "red",
              fontWeight: "bold",
            }}
            href="/"
          >
            YumYum
          </Button>
        </div>
        <MetroSelect />
        <div className={classes.expander} />
        <SearchInput placeholder="Search Yumyum" style={{ width: "200px" }} />
        <div className={classes.expander} />
        <DatePicker
          defaultValue={dayjs(date)}
          onChange={(value, dateString) => {
            setDate(dateString);
            setLastUserSelection({
              date: dateString,
              party_size: party_size,
              timeOption: timeOption,
            });
          }}
        />
        <Select
          defaultValue={party_size}
          style={{ width: 120 }}
          onSelect={(value, option) => {
            setPartySize(parseInt(value.toString()));
            setLastUserSelection({
              date: date,
              party_size: parseInt(value.toString()),
              timeOption: timeOption,
            });
          }}
        >
          <Option value="1"> 1 Guest</Option>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Option key={n} value={n}>
              {n} Guests
            </Option>
          ))}
        </Select>
        {/* <div className={classes.expander} />
        <div>
          <Link
            target="_blank"
            href={DONATION_URL}
            className={classes.donations}
          >
            Buy Us A Coffee
          </Link>
        </div> */}
      </Toolbar>
    </FullDivPadded>
  );
};
