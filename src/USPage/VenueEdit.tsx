import Link from '@material-ui/core/Link';
import { Button, Form, Input, notification, Select, Switch } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification';
import buildUrl from 'build-url';
import React, { useState } from 'react';
import { Link as ReactLink, useParams } from 'react-router-dom';

import { Loading } from '../components/Loading';
import {
  useUpdateVenueInfoMutation,
  useVenueByKeyQuery,
} from "../generated/graphql";
import {
  getVendorRequiredFields,
  VendorRequiredFields,
} from "../yummodule/Vendors";
import { VenueDescription } from "./VenueItems";

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
  const { metro } = useParams<{ metro: string }>();
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
    },
  });

  const venue = data?.venueByKey;

  const [makeChange] = useUpdateVenueInfoMutation({
    onCompleted: (data) => {
      const a: NotificationPlacement = "topLeft";
      const args = {
        message: "Information saved",
        description: `${venue?.name} reservation info saved`,
        duration: 3,
        placement: a,
      };
      notification.open(args);
    },
  });
  const [reservation, setReservation] = useState<string | null>(null);

  if (loading || !venue) {
    return <Loading />;
  }

  const onFinish = (values: any) => {
    values.key = venue_id;
    values.withOnlineReservation = values.withOnlineReservation
      ? "true"
      : "false";
    console.log(values);
    makeChange({
      variables: values,
    });
  };

  const vendorReservation = reservation ? reservation : venue?.reservation!;

  function prefillbutton(res: string, withOnlineReservation: boolean) {
    return (
      <Button
        type="link"
        htmlType="button"
        onClick={() => {
          form.setFieldsValue({
            reservation: res,
            withOnlineReservation: withOnlineReservation,
          });
          setReservation(res);
        }}
      >
        {res}
      </Button>
    );
  }

  return (
    <div>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item {...tailLayout}>
          <h2>
            <Link
              href={buildUrl("http://www.google.com", {
                queryParams: {
                  q: `${venue.name} ${venue.city} reservation`,
                },
              })}
              target={"none"}
            >
              {venue.name}
            </Link>
          </h2>
          <VenueDescription venue={venue!} />
          <div>
            {venue.address}, {venue.city}, {venue.region}
          </div>
          <div>
            {venue.longitude}, {venue.latitude}{" "}
          </div>
          <div>First Introduced {venue.vintage}</div>
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
            {Object.keys(VendorRequiredFields)
              .concat("TBD", "none", "Call/Email")
              .map((k: string) => (
                <Option value={k} key={k}>
                  {k}
                </Option>
              ))}

            {}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          {prefillbutton("opentable", true)}
          {prefillbutton("tock", true)}
          {prefillbutton("resy", true)}
          {prefillbutton("yelp", true)}
          {prefillbutton("sevenrooms", true)}
          {prefillbutton("none", false)}
          {prefillbutton("Call/Email", false)}
          {prefillbutton("TBD", false)}
        </Form.Item>

        {vendorReservation &&
          getVendorRequiredFields(vendorReservation).map((field) => {
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
        <Form.Item
          label="Closed"
          name="close"
          valuePropName="checked"
          initialValue={venue?.close}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Online Reservation"
          name="withOnlineReservation"
          valuePropName="checked"
          initialValue={venue?.withOnlineReservation === "true"}
        >
          <Switch />
        </Form.Item>
        <Form.Item {...tailLayout}>
          Test Link:
          <ReactLink to={`/metro/${metro}/venue/${venue?.key}`}>
            {venue.name}
          </ReactLink>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
