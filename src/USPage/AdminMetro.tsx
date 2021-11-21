import 'antd/dist/antd.css';

import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { Loading } from '../components/Loading';
import { useBayAreaQuery, Venue } from '../generated/graphql';
import { useMetro } from './useMetro';
import { VenueEdit } from './VenueEdit';

export const MetroListAll = () => {
  const metro = useMetro();
  const [searchTerm, setSearchTerm] = useState("");
  const [venuekey, setVenueKey] = useState<string | null>(null);

  const first = useBayAreaQuery({
    variables: {
      metro: metro,
    },
  });

  if (first.loading) {
    return <Loading />;
  }

  const list = first.data?.allVenues?.nodes;

  return (
    <div>
      <Input
        defaultValue={searchTerm}
        onChange={(v) => setSearchTerm(v.target.value)}
      />
      <EditableTable
        list={list!}
        metro={metro}
        onRow={(selectedVenue) => setVenueKey(selectedVenue)}
      />
      {venuekey && <VenueEdit venue_id={venuekey} />}
    </div>
  );
};

type MyTableProps = {
  list: Array<Venue | null>;
  metro: string;
  onRow?: (rowkey: string) => void;
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: any) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  // console.log(record);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ list, onRow }: MyTableProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(list);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    setData(list);
  }, [list]);

  const isEditing = (record: any) => record.key === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      const newData = [...data];
      const index = newData.findIndex((item: any) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Cuisine",
      dataIndex: "cuisine",
      editable: false,
    },
    {
      title: "City",
      dataIndex: "city",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data as any}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log(record);
              onRow && onRow(record.key);
            }, // click row
            // onDoubleClick: (event) => {}, // double click row
            // onContextMenu: (event) => {}, // right button click row
            // onMouseEnter: (event) => {}, // mouse enter row
            // onMouseLeave: (event) => {}, // mouse leave row
          };
        }}
      />
    </Form>
  );
};