import { Avatar, Button, List } from 'antd';
import dayjs from 'dayjs';

import { Venue } from '../generated/graphql';

type RestaurantListProps = {
  list?: Array<Venue | null>;
  date: string;
  party_size: number;
  timeOption: string;
  showLoading?: boolean;
};

export const RestaurantList = ({
  list,
  date,
  party_size,
  timeOption,
  showLoading = false,
}: RestaurantListProps) => {
  return (
    <div>
      <p>
        Showing results for party of {party_size} on {date} for {timeOption}
      </p>
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
              title={
                <a href={item?.coverImage!}>
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
