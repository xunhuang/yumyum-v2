import 'antd/dist/antd.css';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "baseline",
        }}
      >
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          size="large"
          onClick={() => setCurrentIndex((currentIndex - 1) % total!)}
        />
        <span>
          Item # {currentIndex + 1} of total {total}
        </span>
        <Button
          shape="circle"
          icon={<RightOutlined />}
          size="large"
          onClick={() => setCurrentIndex((currentIndex + 1) % total!)}
        />
      </div>
      {venuekey && <VenueEdit venue_id={venuekey} key={venuekey} />}
    </div>
  );
};
