import 'antd/dist/antd.css';

import { Button, Input } from 'antd';
import { useState } from 'react';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, useCreateVenueMutation, Venue } from '../generated/graphql';
import { MetroAPI } from '../yummodule/MetroAPI';
import { useMetro } from './useMetro';


const bayarea = require("../data/BayArea.json");
const Nanoid = require("nanoid");

export const AdminNewVenueImport = () => {
  const metro = useMetro();
  const [searchTerm, setSearchTerm] = useState("");
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

  const entrynodes = first.data?.allVenues?.nodes || [];
  const newOnly = bayarea.filter((entry: any) => {
    const found = entrynodes.find(
      (node: Venue | any, index: number, thisobject: any) => {
        if (node.name === entry.name) {
          return true;
        }
        if (entry.slug === node.michelinslug) {
          return true;
        }
        return false;
      }
    );
    return !found;
  });

  console.log(bayarea[0]);

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
      <Input
        defaultValue={searchTerm}
        onChange={(v) => setSearchTerm(v.target.value)}
      />
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