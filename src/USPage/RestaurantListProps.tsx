import { Avatar, Button, Grid, List } from 'antd';
import React from 'react';

import { Venue } from '../generated/graphql';
import { UserLocation } from './CookieGeoLocation';
import { VenueAvailabilityList, VenueDescription, VenueTitle } from './VenueProp';
import { VenuesMap } from './VenuesMap';

const getDistance = require("geolib").getDistance;

type RestaurantListProps = {
  list?: Array<Venue | null>;
  date?: string;
  party_size?: number;
  timeOption?: string;
  showLoading?: boolean;
  showAvailableOnly?: boolean;
  userLocation?: UserLocation;
  sortByDistanceFromUser?: boolean;
};

const { useBreakpoint } = Grid;

export const RestaurantList = ({
  list,
  date,
  party_size,
  timeOption,
  showLoading = false,
  showAvailableOnly = true,
  userLocation,
  sortByDistanceFromUser = false,
}: RestaurantListProps) => {
  const screens = useBreakpoint();
  var data = list;

  if (showAvailableOnly) {
    data = data?.filter((node) => node?.slots?.length! > 0);
  }
  if (sortByDistanceFromUser && userLocation) {
    data = data?.slice()?.sort((a, b) => {
      let a_d = getDistance(
        { latitude: a?.latitude, longitude: a?.longitude },
        { latitude: userLocation?.latitude, longitude: userLocation?.longitude }
      );
      let b_d = getDistance(
        { latitude: b?.latitude, longitude: b?.longitude },
        { latitude: userLocation?.latitude, longitude: userLocation?.longitude }
      );
      return a_d - b_d;
    });
  }
  const availlist = (
    <RestaurantListRender
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      showLoading={showLoading}
      list={data}
    />
  );

  const showMap = screens.sm || screens.md || screens.lg;
  const [forceShowMap, setForceShooMap] = React.useState(showMap);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        <p>
          Results for {party_size} on {date} for {timeOption}
        </p>
        {!showMap && (
          <Button
            type="dashed"
            onClick={() => {
              setForceShooMap(!forceShowMap);
            }}
          >
            Map
          </Button>
        )}
      </div>
      {forceShowMap && <VenuesMap venues={data as Array<Venue>} />}
      <div style={{ display: "flex" }}>
        {availlist}
        {showMap && <VenuesMap venues={data as Array<Venue>} />}
      </div>
    </div>
  );
};

export const RestaurantListRender = ({
  list,
  date,
  party_size,
  timeOption,
  showLoading = false,
}: RestaurantListProps) => {
  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {},
          pageSize: 20,
        }}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            key={item?.name}
            style={{
              padding: "5px",
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={{
                    xs: 45,
                    sm: 45,
                    md: 45,
                  }}
                  shape="square"
                  src={item?.coverImage}
                />
              }
              title={<VenueTitle venue={item!} />}
              description={<VenueDescription venue={item!} />}
              style={{
                marginBottom: "0px",
              }}
            />
            {showLoading && (
              <Button type="primary" size="small" loading>
                Loading
              </Button>
            )}
            {!showLoading && <VenueAvailabilityList venue={item!} />}
          </List.Item>
        )}
      />
    </div>
  );
};
