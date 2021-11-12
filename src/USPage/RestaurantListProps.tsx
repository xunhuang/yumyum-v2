import { Avatar, Button, List } from 'antd';
import dayjs from 'dayjs';

import { Venue } from '../generated/graphql';
import { UserLocation } from './CookieGeoLocation';

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

  return (
    <div>
      {date && (
        <p>
          Showing results for party of {party_size} on {date} for {timeOption}
        </p>
      )}
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {},
          pageSize: 20,
        }}
        dataSource={data}
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
              title={
                <a href={`/venue/${item?.key}`}>
                  {item?.name}, {item?.stars}
                </a>
              }
              description={`${item?.cuisine}, ${item?.city}, ${item?.priceline}`}
              style={{
                marginBottom: "0px",
              }}
            />
            {showLoading && (
              <Button type="primary" size="small" loading>
                Loading
              </Button>
            )}
            {!showLoading &&
              // the "Set" below is to deduplicate
              [...new Set(item?.slots)].map((timestr) => (
                <Button
                  key={timestr}
                  type="primary"
                  size={"small"}
                  style={{
                    margin: "1px",
                  }}
                  href={item?.myReservationUrl!}
                >
                  {dayjs(timestr).format("h:mm A")}
                </Button>
              ))}
          </List.Item>
        )}
      />
    </div>
  );
};
