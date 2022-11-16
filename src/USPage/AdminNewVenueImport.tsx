import 'antd/dist/antd.css';

import { Input } from 'antd';
import { useState } from 'react';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, Venue } from '../generated/graphql';
import { useMetro } from './useMetro';

// import {default } as bayarea  from '../data/BayArea.json';
const bayarea = require("../data/BayArea.json");

export const AdminNewVenueImport = () => {
  const metro = useMetro();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div>
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
