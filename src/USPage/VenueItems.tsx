import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { Venue } from '../generated/graphql';
import { normalizeUrl } from '../yummodule/YumUtil';
import { useMetro } from './useMetro';

dayjs.extend(utc);
dayjs.extend(timezone);

type VenueProp = {
  venue?: Venue;
};
type AvailabilityListProps = {
  timezone: string;
  url: string;
  slots: Array<string>;
};

export const AvailabilityList = ({
  timezone,
  url,
  slots,
}: AvailabilityListProps) => {
  // dedup first
  return (
    <div>
      {[...new Set(slots)]?.sort().map((timestr) => (
        <Button
          key={timestr}
          type="primary"
          size={"small"}
          style={{
            margin: "1px",
          }}
          href={url}
        >
          {dayjs(timestr).tz(timezone).format("h:mm A")}
        </Button>
      ))}
    </div>
  );
};

export const VenueAvailabilityList = ({ venue }: VenueProp) => {
  return (
    <AvailabilityList
      timezone={venue?.timezone!}
      url={venue?.myReservationUrl!}
      slots={venue?.slots!}
    />
  );
};

export const VenueLinks = ({ venue }: VenueProp) => {
  const maplink = `https://maps.google.com/?q=${venue?.latitude},${venue?.longitude}`;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {venue?.url && <a href={venue?.url!}> Michelin Guide </a>}
      {venue?.realurl && <a href={normalizeUrl(venue?.realurl!)}> WebSite </a>}
      <a href={maplink}> Location </a>
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
    ONE_STAR: "m",
    TWO_STARS: "n",
    THREE_STARS: "o",
    Guide: "‹",
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
  const metro = useMetro();
  return (
    <a href={`/metro/${metro}/venue/${venue?.key}`}>
      {venue?.name} <Stars stars={venue?.stars!} />
      {venue?.vintage && <span>{venue?.vintage}</span>}
    </a>
  );
};

export const VenueDescription = ({ venue }: VenueProp) => {
  return (
    <div>
      {venue?.cuisine?.split(",").join(", ")}, {venue?.city}
      {venue?.priceline && <> , {venue?.priceline}</>}, {venue?.reservation}
    </div>
  );
};
