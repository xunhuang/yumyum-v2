import { Avatar, Card, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { useVenueByKeyQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { VenueCalender } from './VenueCalender';
import { VenueAvailabilityList, VenueDescription, VenueLinks, VenueTitle } from './VenueProp';

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
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "600px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card bordered={false}>
          <Meta
            avatar={<Avatar src={venue?.coverImage} />}
            title={<VenueTitle venue={venue!} />}
            description={<VenueDescription venue={venue!} />}
          />
          <VenueLinks venue={venue!} />
        </Card>
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
    </div>
  );
};
