import "antd/dist/antd.css";

import { Button } from "antd";

import { Loading } from "../components/Loading";
import {
  useBayAreaQuery,
  useRepopulateVenueInfoMutation,
  Venue,
} from "../generated/graphql";
import { JsonEntrySameWasDbEntry } from "../yummodule/JsonEntrySameWasDbEntry";
import { useMetroFromPath } from "./useMetro";
import { useMetroOriginalJson } from "./useMetroOriginalJson";

export const AdminNewVenuesRepopulate = () => {
  const metro = useMetroFromPath();
  const listFromJsonFile = useMetroOriginalJson(metro);
  const [updateVenue] = useRepopulateVenueInfoMutation({
    onCompleted: (data) => {
      // console.log("Venue data repopulated", data);
    },
  });

  const dbData = useBayAreaQuery({
    variables: {
      metro: metro,
    },
  });

  if (dbData.loading) {
    return <Loading />;
  }

  if (listFromJsonFile.length === 0) {
    return <div>Probably wilson hasn't uploaded it</div>;
  }

  const dbentries = dbData.data?.allVenues?.nodes || [];

  async function updateAll() {
    for (const a of listFromJsonFile) {
      const jsonentry: any = a;
      // console.log(jsonentry);
      const venue = dbentries.find(
        (dbentry: Venue | any, index: number, thisobject: any) => {
          return JsonEntrySameWasDbEntry(jsonentry, dbentry);
        }
      );

      if (!venue) {
        console.log("Not found", jsonentry);
        continue;
      }

      let coverImage = jsonentry.main_image?.url;
      if (!coverImage) {
        coverImage = venue.coverImage;
      }
      if (!coverImage) {
        console.log("No cover image", venue.name);
        continue;
      } else {
        console.log(venue.name);
      }

      let imageList = JSON.stringify(
        jsonentry.images?.map((i: any) => i.url) || []
      );

      console.log(jsonentry);

      const v = {
        key: venue.key,
        name: jsonentry.name,
        metro: metro,
        michelinslug: jsonentry.slug,
        michelinobjectid: jsonentry.objectID,
        coverImage: coverImage,
        cuisine: jsonentry.cuisines.map((c: any) => c.label).join(", "),
        imageList: imageList,
        latitude: jsonentry._geoloc.lat,
        longitude: jsonentry._geoloc.lng,
        stars: jsonentry.michelin_award || "MICHELIN_PLATE",
        url: `https://guide.michelin.com${jsonentry.url}`,
        michelineOnlineReservation: jsonentry.online_booking === 1,
      };
      await updateVenue({
        variables: v,
      });
    }
  }

  return (
    <div>
      <Button type="link" htmlType="button" onClick={updateAll}>
        Repopulate!
      </Button>
      <div>Total: {listFromJsonFile?.length}</div>
      <ListTable list={listFromJsonFile!} metro={metro} />
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
