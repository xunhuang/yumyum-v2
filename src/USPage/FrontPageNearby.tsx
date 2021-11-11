import { useRecoilState } from 'recoil';

import { useBayAreaNearbySlotsQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { useIPLocation, UserLocation } from './CookieGeoLocation';
import { RestaurantList } from './RestaurantListProps';

export const FrontPageNearby = () => {
  const location = useIPLocation();
  if (!location) {
    return <p>Loading location</p>;
  }
  return <FrontPageNearLocation location={location!} />;
};

type FrontPageNearLocationProp = {
  location: UserLocation;
};

export const FrontPageNearLocation = ({
  location,
}: FrontPageNearLocationProp) => {
  const delta = 0.15;
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const first = useBayAreaNearbySlotsQuery({
    variables: {
      date: date,
      party_size: party_size,
      timeOption: timeOption,
      maxLatitude: location.latitude + delta,
      minLatitude: location.latitude - delta,
      maxLongitude: location.longitude + delta,
      minLongitude: location.longitude - delta,
    },
  });

  if (first.loading) {
    return <p>loading</p>;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={first.data?.allVenues?.nodes}
      userLocation={location}
      sortByDistanceFromUser={true}
      // showAvailableOnly={false}
    ></RestaurantList>
  );
};
