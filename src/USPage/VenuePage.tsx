import { Avatar, Card } from 'antd';
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
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Card
        style={{ minWidth: 400, margin: "auto" }}
        actions={
          [
            // <SettingOutlined key="setting" />,
            // <EditOutlined key="edit" />,
            // <EllipsisOutlined key="ellipsis" />,
          ]
        }
      >
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={venue?.name}
          description={
            <img
              alt="example"
              src={`${venue?.coverImage}`}
              style={{ maxWidth: "400px" }}
            />
          }
        />
      </Card>
    </div>
  );
};
