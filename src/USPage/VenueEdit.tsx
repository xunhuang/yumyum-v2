import { Button, Form, Input, Select, Switch } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "../components/Loading";
import {
  useUpdateVenueInfoMutation,
  useVenueByKeyQuery,
} from "../generated/graphql";
import { getVendor, VendorMap } from "../yummodule/Vendors";
import { VenueDescription, VenueTitle } from "./VenueItems";

const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

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
  const [reservation, setReservation] = useState<string | null>(null);

  if (loading) {
    return <Loading />;
  }
  const venue = data?.venueByKey;

  const onFinish = (values: any) => {
    values.key = venue_id;
    console.log(values);

    makeChange({
      variables: values,
    });
  };

  const vendor = getVendor(reservation ? reservation : venue?.reservation!);

  return (
    <div>
      <VenueTitle venue={venue!} />
      <VenueDescription venue={venue!} />
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
          initialValue={venue?.reservation!}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a option and change input text above"
            onChange={(value) => setReservation(value)}
            allowClear
            defaultValue={venue?.reservation!}
          >
            {Object.keys(VendorMap).map((k: string) => (
              <Option value={k} key={k}>
                {k}
              </Option>
            ))}

            {}
          </Select>
        </Form.Item>

        {vendor &&
          vendor.requiedFieldsForReservation().map((field) => {
            return (
              <Form.Item
                name={snakeToCamel(field)}
                label={snakeToCamel(field)}
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={(venue as any)[snakeToCamel(field)]}
              >
                <Input />
              </Form.Item>
            );
          })}

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
