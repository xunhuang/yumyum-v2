import { Button } from 'antd';
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

export const VenueTitle = ({ venue }: VenueProp) => {
  return (
    <a href={`/venue/${venue?.key}`}>
      {venue?.name}, {venue?.stars}
    </a>
  );
};

export const VenueDescription = ({ venue }: VenueProp) => {
  return (
    <div>
      ${venue?.cuisine}, ${venue?.city}, ${venue?.priceline}
    </div>
  );
};
