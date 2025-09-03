import React from 'react';
import { useRecoilState } from 'recoil';

import { Loading } from '../components/Loading';
import { useBayAreaNearbySlotsQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { useIPLocation, UserLocation } from './CookieGeoLocation';
import { FetchAndDisplayRestuarantList } from "./ListsPage";

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
  const queryResults = useBayAreaNearbySlotsQuery({
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

  // Move the delta expansion logic to useEffect to avoid calling setState during render
  React.useEffect(() => {
    if (
      queryResults.data?.allVenues?.totalCount! < 100 &&
      !queryResults.loading
    ) {
      console.log("no enough restuarnt found, expanding circle");
      setDelta((prevDelta) => prevDelta * 2);
    }
  }, [queryResults.data?.allVenues?.totalCount, queryResults.loading]);

  if (queryResults.loading) {
    return <Loading />;
  }

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};
