import 'antd/dist/antd.css';

import { Button } from 'antd';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, useCreateVenueMutation, Venue } from '../generated/graphql';
import { JsonEntrySameWasDbEntry } from '../yummodule/JsonEntrySameWasDbEntry';
import { MetroAPI } from '../yummodule/MetroAPI';
import { useMetroFromPath } from './useMetro';
import { useMetroOriginalJson } from './useMetroOriginalJson';


const Nanoid = require("nanoid");

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
  const newOnly = listFromJsonFile.filter((jsonentry: any) => {
    const found = entrynodes.find(
      (dbentry: Venue | any, index: number, thisobject: any) => {
        return JsonEntrySameWasDbEntry(jsonentry, dbentry);
      }
    );
    return !found;
  });


  return (
    <div>
      <Button
        type="link"
        htmlType="button"
        onClick={async () => {
          for (var item of newOnly) {
            const v = {
              key: Nanoid.nanoid(),
              vintage: "2023", // TODO: make this dynamic
              close: false,
              name: item.name,
              metro: metro,
              michelinslug: item.slug,
              michelinobjectid: item.objectID,
              address: item._highlightResult.street.value,
              city: item.city.name,
              country: item.country.name,
              coverImage: item.main_image?.url || "",
              cuisine: item.cuisines.map((c: any) => c.label).join(", "),
              imageList: JSON.stringify(
                item.images?.map((i: any) => i.url) || []
              ),
              latitude: item._geoloc.lat,
              longitude: item._geoloc.lng,
              michelineOnlineReservation: item.online_booking === 1,
              region: item.region.name,
              reservation: "TBD",
              stars: item.michelin_award || "MICHELIN_PLATE",
              timezone: MetroAPI.getMetro(metro).timezone,
              url: item.slug,
              zip: item.slug,
            };
            await createVenue({
              variables: v,
            });
            console.log("Created venue", v.name);
          }
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
    <ul>
      {props.list.map((v) => (
        <li key={v?.name}>
          {v?.name}, {v?.michelin_award || "Plate"},{v?.city.name}
        </li>
      ))}
    </ul>
  );
};
