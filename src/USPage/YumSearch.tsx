import 'antd/dist/antd.css';

import { Select } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { useBayAreaLazyQuery } from '../generated/graphql';
import { useMetro } from './useMetro';

const { Option } = Select;

export const SearchInput = (props: { placeholder: string; style: any }) => {
  const metro = useMetro();
  const [loaded, setLoaded] = useState(false);
  const [loadData, { data }] = useBayAreaLazyQuery({
    variables: {
      metro: metro,
    },
  });
  const history = useHistory();

  const onClick = () => {
    if (!loaded) {
      console.log("load!!!!");
      loadData();
      setLoaded(true);
    }
  };

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Search to Select"
      onClick={onClick}
      onSelect={(value, option) => {
        history.push(`/metro/${metro}/venue/${option.key}`);
      }}
    >
      {data &&
        [...data?.allVenues?.nodes!]
          .sort((a, b) => a?.name!.localeCompare(b?.name!)!)
          .map((v) => (
            <Option key={v?.key!} value={v?.name!}>
              {v?.name}
            </Option>
          ))}
    </Select>
  );
};
