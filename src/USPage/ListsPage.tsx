import "antd/dist/antd.css";

import { Tabs } from "antd";
import Link from "antd/lib/typography/Link";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import { Loading } from "../components/Loading";
import {
  useBayArea2021WithSlotsQuery,
  useBayAreaAllWithSlotsQuery,
  useBayAreaBibWithSlotsQuery,
  useBayAreaLazyQuery,
  useBayAreaLegacyWithSlotsQuery,
  useBayAreaOfflineQuery,
  useBayAreaPlatesWithSlotsQuery,
  useBayAreaQuery,
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

  const { data, loading } = useBayAreaPlatesWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};
export const ListBibOnly = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const metro = useMetro();

  const { data, loading } = useBayAreaBibWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};
export const ListMichelinLegacy = () => {
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const metro = useMetro();

  const { data, loading } = useBayAreaLegacyWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};
export const List2021Only = () => {
  const metro = useMetro();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const { data, loading } = useBayArea2021WithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};

export const ListStarsOnly = () => {
  const metro = useMetro();
  const [date] = useRecoilState(SelectedDateState);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);

  const { data, loading } = useBayAreaStarredWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={data?.allVenues?.nodes}
    ></RestaurantList>
  );
};

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

  const first = useBayAreaQuery({
    variables: {
      metro: metro,
    },
  });

  const second = useBayAreaAllWithSlotsQuery({
    variables: {
      metro: metro,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });

  if (first.loading) {
    return <Loading />;
  }

  if (second.loading) {
    return (
      <RestaurantList
        list={first.data?.allVenues?.nodes}
        date={date}
        party_size={party_size}
        timeOption={timeOption}
        showAvailableOnly={false}
        showLoading={true}
      ></RestaurantList>
    );
  }

  return (
    <RestaurantList
      date={date}
      party_size={party_size}
      timeOption={timeOption}
      list={second.data?.allVenues?.nodes}
    ></RestaurantList>
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
      text: "New in 22-24",
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
