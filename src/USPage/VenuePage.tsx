import { Avatar, Calendar, Card, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { Moment } from 'moment';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { useVenueByKeyQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { VenueAvailabilityList, VenueDescription, VenueTitle } from './VenueProp';

export const VenueCalender = () => {
  const { venue_id } = useParams<{ venue_id: string }>();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });
  if (loading) {
    return <p>loading</p>;
  }

  const venue = data?.allVenues?.nodes[0];
  const dateMap = venue?.monthlySlots?.reduce(
    (map, obj) => map.set(obj.date!, obj?.slots!),
    new Map<string, any>()
  );

  const onDisableDates = (date: Moment): boolean => {
    const entry = dateMap?.get(date.format("YYYY-MM-DD"));
    return !entry || entry?.length === 0;
  };

  const fullCellRender = (date: Moment) => {
    if (onDisableDates(date)) {
      return <div className={"calendar-date-not-available"}>{date.date()}</div>;
    }

    if (date.isSame(new Date(), "day")) {
      return (
        <div className={"calendar-date-box calendar-date-available-today"}>
          {date.date()}
        </div>
      );
    }

    return (
      <div className={"calendar-date-box calendar-date-available"}>
        {date.date()}
      </div>
    );
  };

  return (
    <div className="site-calendar-demo-card">
      <Calendar
        fullscreen={false}
        disabledDate={onDisableDates}
        mode="month"
        dateFullCellRender={fullCellRender}
      />
    </div>
  );
};

export const VenuePage = () => {
  const { venue_id } = useParams<{ venue_id: string }>();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });
  if (loading) {
    return <p>loading</p>;
  }
  const venue = data?.allVenues?.nodes[0];
  const imageList =
    venue?.imageList && (JSON.parse(venue.imageList) as Array<string>);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Card
        actions={
          [
            // <SettingOutlined key="setting" />,
            // <EditOutlined key="edit" />,
            // <EllipsisOutlined key="ellipsis" />,
          ]
        }
      >
        <Meta
          avatar={<Avatar src={venue?.coverImage} />}
          title={<VenueTitle venue={venue!} />}
          description={
            <div>
              <VenueDescription venue={venue!} />
              <VenueAvailabilityList venue={venue!}></VenueAvailabilityList>
              <Carousel
                swipeToSlide
                draggable
                // autoplay
                style={{
                  maxWidth: "500px",
                  height: "400px",
                  overflow: "hidden",
                }}
              >
                {imageList &&
                  imageList.map((image) => (
                    <div className={"carousel_container"}>
                      <img
                        src={image}
                        alt="imagex"
                        style={{
                          height: "400px",
                          display: "inline-block",
                        }}
                      />
                    </div>
                  ))}
              </Carousel>
              <VenueCalender />
            </div>
          }
        />
      </Card>
    </div>
  );
};
