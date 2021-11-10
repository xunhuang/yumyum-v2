import 'antd/dist/antd.css';

import { Avatar, Button, List } from 'antd';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';

import { useBayAreaQuery, useBayAreaWithSlotsQuery, Venue } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';

type RestaurantListProps = {
  list?: Array<Venue | null>;
  date: string;
  party_size: number;
  timeOption: string;
  showLoading?: boolean;
};

export const FrontPageOld = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const first = useBayAreaQuery();
  const second = useBayAreaWithSlotsQuery({
    variables: {
      date: date,
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
export const FrontPage = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const first = useBayAreaQuery();

  if (first.loading) {
    return "loading";
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={first.data?.allVenues?.nodes}
      showLoading={true}
    ></RestaurantList>
  );
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
