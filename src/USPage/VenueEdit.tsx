import { Button, Form, Select, Switch } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '../components/Loading';
import { useUpdateVenueInfoMutation, useVenueByKeyQuery } from '../generated/graphql';
import { VendorMap } from "../yummodule/Vendors";
import { VenueDescription, VenueTitle } from "./VenueItems";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

type VenueEditProps = {
  venue_id: string;
};

export const VenueEditFromURL = () => {
  const { venue_id } = useParams<{ venue_id: string }>();
  return <VenueEdit venue_id={venue_id} />;
};

export const VenueEdit = ({ venue_id }: VenueEditProps) => {
  const [form] = Form.useForm();
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
    },
  });
  const [makeChange] = useUpdateVenueInfoMutation();

  if (loading) {
    return <Loading />;
  }
  const venue = data?.venueByKey;

  const onFinish = (values: any) => {
    console.log(values);
    makeChange({
      variables: {
        key: venue_id,
        close: values.close,
      },
    });
  };

  return (
    <div>
      <VenueTitle venue={venue!} />
      <VenueDescription venue={venue!} />
      {/* {JSON.stringify(venue, null, 2)} */}
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        {/* <Form.Item
          name="note"
          label="Note"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
 */}
        <Form.Item
          label="Closed"
          name="close"
          valuePropName="checked"
          initialValue={venue?.close}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="reservation"
          label="Reservation System"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            // onChange={onGenderChange}
            allowClear
            defaultValue={venue?.reservation!}
          >
            {Object.keys(VendorMap).map((k: string) => (
              <Option value={k} key={k}>
                {k}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      );
    </div>
  );
};
