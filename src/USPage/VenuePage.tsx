import { Avatar, Card, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useParams } from 'react-router-dom';

import { useVenueByKeyQuery } from '../generated/graphql';

export const VenuePage = () => {
  const { venue_id } = useParams<{ venue_id: string }>();
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
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
            <Carousel
              swipeToSlide
              draggable
              autoplay
              style={{ maxWidth: "500px" }}
            >
              {imageList &&
                imageList.map((image) => <img src={image} alt="imagex" />)}
            </Carousel>
          }
        />
      </Card>
    </div>
  );
};
