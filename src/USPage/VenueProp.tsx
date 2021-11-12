import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';

import { Venue } from '../generated/graphql';

type VenueProp = {
  venue?: Venue;
};

export const VenueAvailabilityList = ({ venue }: VenueProp) => {
  // dedup first
  return (
    <div>
      {[...new Set(venue?.slots)]?.map((timestr) => (
        <Button
          key={timestr}
          type="primary"
          size={"small"}
          style={{
            margin: "1px",
          }}
          href={venue?.myReservationUrl!}
        >
          {dayjs(timestr).format("h:mm A")}
        </Button>
      ))}
    </div>
  );
};

type StarsType = {
  stars: string;
};

const Stars = ({ stars }: StarsType) => {
  const starmap: { [name: string]: string } = {
    "1": "m",
    "2": "n",
    "3": "o",
    MICHELIN_PLATE: "‹",
    BIB_GOURMAND: "=",
  };

  const tip: { [name: string]: string } = {
    "1": "One Michelin Star",
    "2": "Two Michelin Stars",
    "3": "Three Michelin Stars",
    MICHELIN_PLATE: "Michelin Plate",
    BIB_GOURMAND: "Bib Gourmand (Good Value)",
  };
  const star: any = starmap[stars];
  if (!star) {
    return <span />;
  }

  return (
    <Tooltip title={tip[stars]}>
      <span
        style={{
          color: "#bd2333",
          fontFamily: "michelinIcon",
          fontSize: 24,
        }}
      >
        {star}
      </span>
    </Tooltip>
  );
};

export const VenueTitle = ({ venue }: VenueProp) => {
  return (
    <a href={`/venue/${venue?.key}`}>
      {venue?.name} <Stars stars={venue?.stars!} />
    </a>
  );
};

export const VenueDescription = ({ venue }: VenueProp) => {
  return (
    <div>
      {venue?.cuisine}, {venue?.city}, {venue?.priceline}
    </div>
  );
};
