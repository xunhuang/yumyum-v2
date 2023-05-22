import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Select } from 'antd';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { setLastUserSelection } from '../USPage/CookieUserSelection';
import { MetroState, useMetro } from '../USPage/useMetro';
import { SearchInput } from '../USPage/YumSearch';
import { YProfileCircle } from '../YProfileCircle';
import { MetroDefiniton } from '../yummodule/metro_def';
import DatePicker from './DatePicker';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from './SelectedDateState';

const { useBreakpoint } = Grid;

export const FullDivPadded = styled.div`
  margin: 3px;
`;
const { Option } = Select;

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: "flex",
  },
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
      bordered={false}
      onSelect={(value: any, option: any) => {
        setMetro(value);
        history.push(`/metro/${value}/list/stars`);
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
  const screens = useBreakpoint();
  const wideScreen = screens.sm || screens.md || screens.lg;

  const [date, setDate] = useRecoilState(SelectedDateState);
  const [party_size, setPartySize] = useRecoilState(SelectedPartySize);
  const [timeOption, setTimeOption] = useRecoilState(SelectedTimeOption);

  const logo = (
    <Button
      type="primary"
      size="large"
      style={{
        background: "red",
        borderColor: "red",
        fontWeight: "bold",
        marginRight: "5px",
      }}
      href="/"
    >
      YumYum
    </Button>
  );
  const date_picker = (
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
  );
  const party_picker = (
    <Select
      defaultValue={party_size}
      style={{ width: 120 }}
      onSelect={(value: any, option: any) => {
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
  );
  const time_picker = (
    <Select
      defaultValue={timeOption}
      style={{ width: 120 }}
      onSelect={(value: any, option: any) => {
        setTimeOption(value.toString());
        setLastUserSelection({
          date: date,
          party_size: party_size,
          timeOption: value.toString(),
        });
      }}
    >
      <Option value="dinner"> Dinner</Option>
      <Option value="lunch"> Lunch</Option>
    </Select>
  );

  return (
    <div>
      {wideScreen && (
        <Toolbar className={classes.appBar}>
          {logo}
          <MetroSelect />
          <SearchInput placeholder="Search Yumyum" style={{ flexGrow: 1 }} />
          {date_picker}
          {time_picker}
          {party_picker}
          <YProfileCircle />
        </Toolbar>
      )}
      {!wideScreen && (
        <Fragment>
          <Toolbar className={classes.appBar}>
            {/* <YProfileCircle /> */}
            <MetroSelect />
            {logo}
            <SearchInput
              placeholder="Search Yumyum"
              style={{ minWidth: "200px" }}
            />
          </Toolbar>
          <Toolbar className={classes.appBar}>
            {/* <MetroSelect /> */}
            {time_picker}
            <div className={classes.expander} />
            {date_picker}
            <div className={classes.expander} />
            {party_picker}
          </Toolbar>
        </Fragment>
      )}
    </div>
  );
};
