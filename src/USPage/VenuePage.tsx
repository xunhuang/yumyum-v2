import { Avatar, Card, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { useVenueByKeyQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { VenueAvailabilityList } from './VenueProp';

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
          title={venue?.name}
          description={
            <div>
              <VenueAvailabilityList venue={venue!}></VenueAvailabilityList>
              <Carousel
                swipeToSlide
                draggable
                autoplay
                style={{ maxWidth: "500px", maxHeight: "400px" }}
              >
                {imageList &&
                  imageList.map((image) => <img src={image} alt="imagex" />)}
              </Carousel>
            </div>
          }
        />
      </Card>
    </div>
  );
};
