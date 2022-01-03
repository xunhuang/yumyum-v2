import 'antd/dist/antd.css';

import React, { useState } from 'react';

import { Loading } from '../components/Loading';
import { useMetroTbdQuery } from '../generated/graphql';
import { useMetro } from './useMetro';
import { VenueEdit } from './VenueEdit';

export const MetroListTBD = () => {
  const metro = useMetro();
  const [currentIndex, setCurrentIndex] = useState(0);

  const first = useMetroTbdQuery({
    variables: {
      metro: metro,
    },
  });

  if (first.loading) {
    return <Loading />;
  }

  const venue = first?.data?.allVenues?.nodes[currentIndex];
  const total = first?.data?.allVenues?.nodes.length;
  const venuekey = venue?.key;

  return (
    <div>
      <div>
        <span
          onClick={() => {
            setCurrentIndex((currentIndex - 1) % total!);
          }}
        >
          Left
        </span>
        <span>
          Item # {currentIndex + 1} of total {total}
        </span>
        <span
          onClick={() => {
            setCurrentIndex((currentIndex + 1) % total!);
          }}
        >
          Right
        </span>
      </div>
      {venuekey && <VenueEdit venue_id={venuekey} key={venuekey} />}
    </div>
  );
};
