import 'antd/dist/antd.css';

import { Tabs } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';

import {
  useBayAreaAllWithSlotsQuery,
  useBayAreaBibWithSlotsQuery,
  useBayAreaOfflineQuery,
  useBayAreaPlatesWithSlotsQuery,
  useBayAreaQuery,
  useBayAreaStarredWithSlotsQuery,
} from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { FrontPageNearby } from './FrontPageNearby';
import { RestaurantList } from './RestaurantListProps';

const { TabPane } = Tabs;
export const FrontPagePlatesOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const { data, loading } = useBayAreaPlatesWithSlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};
export const FrontPageBibOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const { data, loading } = useBayAreaBibWithSlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};
export const FrontPageStarredOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const { data, loading } = useBayAreaStarredWithSlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <p>loading</p>;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};

export const FrontPageAll = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const first = useBayAreaQuery();
  const second = useBayAreaAllWithSlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (first.loading) {
    return <p>loading</p>;
  }

  if (second.loading) {
    return (
      <RestaurantList
        list={first.data?.allVenues?.nodes}
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        showAvailableOnly={false}
        showLoading={true}
      ></RestaurantList>
    );
  }

  if (true) {
    return (
      <RestaurantList
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        list={second.data?.allVenues?.nodes}
      ></RestaurantList>
    );
  }
};

export const FrontPageOfflineVenues = () => {
  const { data, loading } = useBayAreaOfflineQuery();
  if (loading) {
    return <p>loading</p>;
  }

  return (
    <div>
      <p>Call or walk in. Good luck and enjoy! </p>
      <RestaurantList
        list={data?.allVenues?.nodes}
        showAvailableOnly={false}
      ></RestaurantList>
    </div>
  );
};

export const FrontPage = () => {
  return (
    <Tabs defaultActiveKey="1" type="card" size={"large"}>
      <TabPane tab="Nearby" key="1">
        <FrontPageNearby />
      </TabPane>
      <TabPane tab="New 2021" key="5">
        New in 2021, coming soon
      </TabPane>
      <TabPane tab="stars" key="2">
        <FrontPageStarredOnly />
      </TabPane>
      <TabPane tab="Plates" key="3">
        <FrontPagePlatesOnly />
      </TabPane>
      <TabPane tab="Bib" key="4">
        <FrontPageBibOnly />
      </TabPane>
      <TabPane tab="Offine" key="6">
        <FrontPageOfflineVenues></FrontPageOfflineVenues>
      </TabPane>
      <TabPane tab="All" key="7">
        <FrontPageAll />
      </TabPane>
    </Tabs>
  );
};


