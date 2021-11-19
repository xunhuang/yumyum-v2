import 'antd/dist/antd.css';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, Venue } from '../generated/graphql';
import { useMetro } from './useMetro';

export const MetroListAll = () => {
  const metro = useMetro();

  const first = useBayAreaQuery({
    variables: {
      metro: metro,
    },
  });

  if (first.loading) {
    return <Loading />;
  }

  return (
    <div>
      <MyTable list={first.data?.allVenues?.nodes} />
    </div>
  );
};

type MyTableProps = {
  list?: Array<Venue | null>;
};

export const MyTable = ({ list }: MyTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [inputRef, setInputRef] = useState<Input | null>(null);
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            setInputRef(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => inputRef?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "cuisine",
      dataIndex: "cuisine",
      key: "cuisine",
      width: "20%",
      ...getColumnSearchProps("cuisine"),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...getColumnSearchProps("city"),
      sorter: (a: any, b: any) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
  ];
  return <Table columns={columns as any} dataSource={list as any} />;
};
