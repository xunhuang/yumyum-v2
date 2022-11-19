import 'antd/dist/antd.css';

import { Button } from 'antd';
import { useEffect, useState } from 'react';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, useCreateVenueMutation, Venue } from '../generated/graphql';
import { MetroAPI } from '../yummodule/MetroAPI';
import { useMetroFromPath } from './useMetro';

const Nanoid = require("nanoid");

const useMetroOriginalJson = (metro: string) => {
  const [data, setData] = useState([]);
  const filepath = `/data/${metro}.json`;
  useEffect(() => {
    fetch(filepath, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  }, [filepath]);
  return data;
};

export const AdminNewVenueImport = () => {
  const metro = useMetroFromPath();
  const listFromJsonFile = useMetroOriginalJson(metro);
  const [createVenue] = useCreateVenueMutation({
    onCompleted: (data) => {
      console.log("Created venue", data);
    },
  });

  const first = useBayAreaQuery({
    variables: {
      metro: metro,
    },
  });

  if (first.loading) {
    return <Loading />;
  }

  if (listFromJsonFile.length === 0) {
    return <div>Probably wilson hasn't uploaded it</div>;
  }

  const entrynodes = first.data?.allVenues?.nodes || [];
  const newOnly = listFromJsonFile.filter((entry: any) => {
    const found = entrynodes.find(
      (node: Venue | any, index: number, thisobject: any) => {
        if (node.name === entry.name) {
          return true;
        }
        if (entry.slug === node.michelinslug) {
          return true;
        }

        if (entry._highlightResult.street.value === node.address) {
          console.log(
            "Found by address",
            entry._highlightResult.street.value,
            node.address
          );
          return true;
        }
        return false;
      }
    );
    return !found;
  });

  return (
    <div>
      <Button
        type="link"
        htmlType="button"
        onClick={() => {
          newOnly.map((item: any) => {
            const v = {
              key: Nanoid.nanoid(),
              vintage: "2022",
              close: false,
              name: item.name,
              metro: metro,
              michelinslug: item.slug,
              address: item._highlightResult.street.value,
              city: item.city.name,
              country: item.country.name,
              coverImage: item.main_image.url,
              cuisine: item.cuisines.map((c: any) => c.label).join(", "),
              imageList: JSON.stringify(item.images.map((i: any) => i.url)),
              latitude: item._geoloc.lat,
              longitude: item._geoloc.lng,
              michelineOnlineReservation: item.online_booking === 1,
              region: item.region.name,
              reservation: "TBD",
              stars: item.michelin_award || "Guide",
              timezone: MetroAPI.getMetro(metro).timezone,
              url: item.slug,
              zip: item.slug,
            };
            createVenue({
              variables: v,
            });
            return true;
          });
        }}
      >
        Import!
      </Button>
      <div>Total: {newOnly?.length}</div>
      <ListTable list={newOnly!} metro={metro} />
    </div>
  );
};

type MyTableProps = {
  list: Array<any | null>;
  metro: string;
};

const ListTable = (props: MyTableProps) => {
  return (
    <div>
      {props.list.map((v) => (
        <div key={v?.name}>{v?.name}</div>
      ))}
    </div>
  );
};
