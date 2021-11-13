import React from 'react';
import { useRecoilState } from 'recoil';

import { useBayAreaNearbySlotsQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { useIPLocation, UserLocation } from './CookieGeoLocation';
import { RestaurantList } from './RestaurantListProps';


export const NearbyVenues = () => {
  const location = useIPLocation();
  if (!location) {
    return <p>Loading location</p>;
  }
  return <VenuesNearLocation location={location!} />;
};

type FrontPageNearLocationProp = {
  location: UserLocation;
};

const VenuesNearLocation = ({ location }: FrontPageNearLocationProp) => {
  const [delta, setDelta] = React.useState<number>(0.25);
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

  if (first.data?.allVenues?.totalCount! < 100) {
    console.log("no enough restuarnt found, expanding circle " + delta);
    setDelta(delta * 2);
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={first.data?.allVenues?.nodes}
      userLocation={location}
      sortByDistanceFromUser={true}
    ></RestaurantList>
  );
};
