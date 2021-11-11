import 'antd/dist/antd.css';

import { Tabs } from 'antd';
import React from 'react';
import { useRecoilState } from 'recoil';

import { useBayAreaOfflineQuery, useBayAreaQuery, useBayAreaWithSlotsQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { FrontPageNearby } from './FrontPageNearby';
import { RestaurantList } from './RestaurantListProps';

const { TabPane } = Tabs;

export const FrontPageOld = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const first = useBayAreaQuery();
  const second = useBayAreaWithSlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
      first: 100,
    },
  });

  // const third = useBayAreaWithSlotsQuery({
  //   variables: {
  //     date: date,
  //     first: 500,
  //   },
  // });

  if (first.loading) {
    return "loading";
  }

  if (second.loading) {
    return (
      <RestaurantList
        list={first.data?.allVenues?.nodes}
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        showLoading={true}
      ></RestaurantList>
    );
  }

  // if (!third.called || third.loading) {
  if (true) {
    return (
      <RestaurantList
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        list={second.data?.allVenues?.nodes.filter(
          (node) => node?.slots?.length! > 0
          // (node) => true
        )}
      ></RestaurantList>
    );
  }

  // return (
  //   <RestaurantList
  //     list={third.data?.allVenues?.nodes.filter(
  //       (node) => node?.slots?.length! > 0
  //       // (node) => true
  //     )}
  //   ></RestaurantList>
  // );
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
        Content of card tab 1
      </TabPane>
      <TabPane tab="Plates" key="3">
        Content of card tab 3
      </TabPane>
      <TabPane tab="Bib" key="4">
        bib
      </TabPane>
      <TabPane tab="Offine" key="6">
        <FrontPageOfflineVenues></FrontPageOfflineVenues>
      </TabPane>
      <TabPane tab="All" key="7">
        All
      </TabPane>
    </Tabs>
  );
};


