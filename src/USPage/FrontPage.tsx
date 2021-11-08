import 'antd/dist/antd.css';

import { Avatar, Button, List, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useRecoilState } from 'recoil';

import { useBayAreaQuery, useBayAreaWithSlotsQuery, Venue } from '../generated/graphql';
import { SelectedDateState } from '../HeaderFooter/SelectedDateState';

type RestaurantListProps = {
  list?: Array<Venue | null>;
  showLoading?: boolean;
};

export const FrontPage = () => {
  const [date] = useRecoilState(SelectedDateState);
  const { data, loading } = useBayAreaQuery();
  const real = useBayAreaWithSlotsQuery({
    variables: {
      date: date,
    },
  });
  if (loading) {
    return "loading";
  }
  if (real.loading) {
    return (
      <RestaurantList
        list={data?.allVenues?.nodes}
        showLoading={true}
      ></RestaurantList>
    );
  }
  return (
    <RestaurantList
      list={real.data?.allVenues?.nodes.filter(
        (node) => node?.slots?.length! > 0
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
        onChange: (page) => {
          console.log(page);
        },
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
            item?.slots?.map((timestr) => (
              <Space size="large">
                <Button
                  type="primary"
                  size={"small"}
                  style={{
                    margin: "1px",
                  }}
                >
                  {dayjs(timestr).format("h:mm A")}
                </Button>
              </Space>
            ))}
        </List.Item>
      )}
    />
  );
};
