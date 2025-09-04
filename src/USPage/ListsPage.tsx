import "antd/dist/antd.css";

import { Tabs } from "antd";
import Link from "antd/lib/typography/Link";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import { Loading } from "../components/Loading";
import {
  useBayArea2021WithSlotsQuery,
  useBayAreaAllWithSlotsQuery,
  useBayAreaBibWithSlotsQuery,
  useBayAreaLegacyWithSlotsQuery,
  useBayAreaOfflineQuery,
  useBayAreaPlatesWithSlotsQuery,
  useBayAreaStarredWithSlotsQuery,
} from "../generated/graphql";
import {
  SelectedDateState,
  SelectedPartySize,
  SelectedTimeOption,
} from "../HeaderFooter/SelectedDateState";
import { useProfile } from "../YProfileCircle";
import { NearbyVenues } from "./NearbyVenues";
import { RestaurantList } from "./RestaurantList";
import { useMetro } from "./useMetro";

const { TabPane } = Tabs;
export const ListPlatesOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const metro = useMetro();

  const queryResults = useBayAreaPlatesWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};
export const ListBibOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const metro = useMetro();

  const queryResults = useBayAreaBibWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};
export const ListMichelinLegacy = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const metro = useMetro();

  const queryResults = useBayAreaLegacyWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};
export const List2021Only = () => {
  const metro = useMetro();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const queryResults = useBayArea2021WithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};

const BATCH_FIND_RESERVATION_URL = process.env.REACT_APP_GRAPHQL_ENDPOINT
  ? process.env.REACT_APP_GRAPHQL_ENDPOINT.replace(
      /graphql$/,
      "batchFindReservation"
    )
  : "https://graph-3khoexoznq-uc.a.run.app/batchFindReservation";

function useFetchVenuesTimeSlots(
  queryResults: any,
  date: string,
  party_size: number,
  timeOption: string
) {
  const [slots, setSlots] = useState<string[] | null>(null);

  useEffect(() => {
    if (queryResults.data) {
      const fetchData = async () => {
        try {
          const nodes = queryResults.data.allVenues?.nodes;
          const response = await fetch(BATCH_FIND_RESERVATION_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date,
              party_size,
              timeOption,
              nodes,
            }),
          });

          const reader = response.body?.getReader();
          if (!reader) return;

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Decode and parse the chunk
            const chunk = new TextDecoder().decode(value);
            const newResults = chunk
              .split("\n")
              .filter((line) => line.trim())
              .map((line) => JSON.parse(line));

            // Append new results to existing slots
            setSlots((prevSlots) => {
              if (!prevSlots) return newResults;
              return [...prevSlots, ...newResults];
            });
          }
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchData();
    }
  }, [queryResults.data, date, party_size, timeOption]);

  if (queryResults.loading || !slots) {
    return { nodesWithSlots: null, loading: true };
  }
  const slotmap = slots.reduce<Record<string, any>>((acc, slot: any) => {
    if ("key" in slot && typeof slot.key === "string") {
      acc[slot.key] = slot;
    }
    return acc;
  }, {} as Record<string, object>);

  const nodesWithSlots = queryResults.data?.allVenues?.nodes?.map(
    (node: any) => {
      if (node?.key) {
        if (slotmap[node.key]?.slots) {
          return {
            ...node,
            slots: slotmap[node.key]?.slots,
          };
        }
        return node;
      }
      return node;
    }
  );

  return {
    restuarantList: nodesWithSlots,
    initialLoading: queryResults.loading,
    totalCount: queryResults.data?.allVenues?.nodes?.length,
    fetchCompleted: slots.length || 0,
  };
}

export const ListStarsOnly = () => {
  const metro = useMetro();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const queryResults = useBayAreaStarredWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};

interface FetchAndDisplayRestuarantListProps {
  queryResults: any;
  date: string;
  party_size: number;
  timeOption: string;
}

export function FetchAndDisplayRestuarantList({
  queryResults,
  date,
  party_size,
  timeOption,
}: FetchAndDisplayRestuarantListProps) {
  const { restuarantList, initialLoading, totalCount, fetchCompleted } =
    useFetchVenuesTimeSlots(queryResults, date, party_size, timeOption);
  if (initialLoading || !restuarantList) {
    return <Loading initialLoading={initialLoading} />;
  }
  return (
    <div>
      {totalCount > 0 && fetchCompleted! < totalCount && (
        <Loading
          initialLoading={initialLoading}
          total={totalCount}
          fetchCompleted={fetchCompleted}
        />
      )}
      <RestaurantList
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        list={restuarantList as any}
      ></RestaurantList>
    </div>
  );
}

export const ListAllLoggedInOnly = () => {
  const [profile] = useProfile();
  if (!profile) {
    return <div> Expensive feature. Logged in user only. </div>;
  }
  return <ListAll />;
};

export const ListAll = () => {
  const metro = useMetro();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const queryResults = useBayAreaAllWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  return (
    <FetchAndDisplayRestuarantList
      queryResults={queryResults}
      date={date}
      party_size={party_size}
      timeOption={timeOption}
    />
  );
};

export const ListOffLineOnly = () => {
  const metro = useMetro();
  const { data, loading } = useBayAreaOfflineQuery({
    variables: {
      metro: metro,
    },
  });
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <p>Call or walk in. Good luck and enjoy! </p>
      <RestaurantList
        list={data?.allVenues?.nodes}
        showAvailableOnly={false}
      ></RestaurantList>
    </div>
  );
};

export const ListsPage = () => {
  const { metro, listname } = useParams<{ metro: string; listname: string }>();
  const systemmetro = useMetro();
  const [profile] = useProfile();
  const key = listname ? listname : "nearby";

  const myMetro = metro ? metro : systemmetro;

  type paneldataType = {
    slug: string;
    text: string;
    component: JSX.Element;
  };

  let panedata: paneldataType[] = [
    {
      slug: "nearby",
      text: "Nearby",
      component: <NearbyVenues />,
    },
    {
      slug: "new",
      text: "New in 22-25",
      component: <List2021Only />,
    },
    {
      slug: "stars",
      text: "Stars",
      component: <ListStarsOnly />,
    },
    {
      slug: "plates",
      text: "Plates",
      component: <ListPlatesOnly />,
    },
    {
      slug: "bib",
      text: "Bib",
      component: <ListBibOnly />,
    },
    {
      slug: "legacy",
      text: "Legacy",
      component: <ListMichelinLegacy />,
    },
    {
      slug: "offline",
      text: "Offline",
      component: <ListOffLineOnly />,
    },
    {
      slug: "all",
      text: "All",
      component: <ListAllLoggedInOnly />,
    },
  ];

  if (profile?.email === "xhuang@gmail.com") {
    panedata.push({
      slug: "admin",
      text: "Admin",
      component: MetroAdminPage(metro),
    });
  }
  return (
    <Tabs activeKey={key} type="card" size={"large"}>
      {panedata.map((panel) => (
        <TabPane
          tab={
            <Link href={`/metro/${myMetro}/list/${panel.slug}`}>
              {panel.text}
            </Link>
          }
          key={panel.slug}
        >
          {panel.component}
        </TabPane>
      ))}
    </Tabs>
  );
};

function MetroAdminPage(metro: string): JSX.Element {
  return (
    <div>
      <h4>Admin page for {metro}</h4>
      <ol>
        <li>
          <Link href={`/metro/${metro}/import`}>Import from Michelin JSON</Link>
        </li>
        <li>
          <Link href={`/metro/${metro}/admin`}>Admin metro's full list</Link>
        </li>
        <li>
          <Link href={`/metro/${metro}/tbd`}>
            Admin metro's TBD list (new places without reservation setting)
          </Link>
        </li>
        <li>
          <Link href={`/metro/${metro}/repopulate`}>
            Tool to re-populate Michelin data (new rating, pictures etc)
          </Link>
        </li>
      </ol>
    </div>
  );
}
