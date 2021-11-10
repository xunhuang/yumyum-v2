import 'antd/dist/antd.css';

import { useRecoilState } from 'recoil';

import { useBayAreaQuery, useBayAreaWithSlotsQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { RestaurantList } from './RestaurantListProps';

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


