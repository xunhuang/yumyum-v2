import 'antd/dist/antd.css';

import { Avatar, Button, List } from 'antd';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';

import { useBayAreaQuery, useBayAreaWithSlotsQuery, Venue } from '../generated/graphql';
import { SelectedDateState } from '../HeaderFooter/SelectedDateState';

type RestaurantListProps = {
  list?: Array<Venue | null>;
  showLoading?: boolean;
};

export const FrontPage = () => {
  const [date] = useRecoilState(SelectedDateState);

  const first = useBayAreaQuery();
  const second = useBayAreaWithSlotsQuery({
    variables: {
      date: date,
      first: 30,
    },
  });

  const third = useBayAreaWithSlotsQuery({
    variables: {
      date: date,
      first: 500,
    },
  });

  if (first.loading) {
    return "loading";
  }

  if (second.loading) {
    return (
      <RestaurantList
        list={first.data?.allVenues?.nodes}
        showLoading={true}
      ></RestaurantList>
    );
  }

  if (!third.called || third.loading) {
    return (
      <RestaurantList
        list={second.data?.allVenues?.nodes.filter(
          (node) => node?.slots?.length! > 0
          // (node) => true
        )}
      ></RestaurantList>
    );
  }

  return (
    <RestaurantList
      list={third.data?.allVenues?.nodes.filter(
        (node) => node?.slots?.length! > 0
        // (node) => true
      )}
    ></RestaurantList>
  );
};

export const RestaurantList = ({
  list,
  showLoading = false,
}: RestaurantListProps) => {
  return (
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
  );
};
