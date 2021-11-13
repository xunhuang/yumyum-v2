import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Calendar } from 'antd';
import moment, { Moment } from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { useVenueByKeyQuery } from '../generated/graphql';
import { SelectedDateState, SelectedPartySize, SelectedTimeOption } from '../HeaderFooter/SelectedDateState';
import { AvailabilityList } from './VenueProp';

export const VenueCalender = () => {
  const { venue_id } = useParams<{ venue_id: string }>();
  const [date, setDate] = useRecoilState(SelectedDateState);
  const [selectdDate, setSelectedDate] = React.useState(date);
  const [party_size] = useRecoilState(SelectedPartySize);
  const [timeOption] = useRecoilState(SelectedTimeOption);
  const { data, loading } = useVenueByKeyQuery({
    variables: {
      key: venue_id,
      date: date,
      party_size: party_size,
      timeOption: timeOption,
    },
  });
  if (loading) {
    return <p>loading</p>;
  }

  const venue = data?.allVenues?.nodes[0];
  const dateMap = venue?.monthlySlots?.reduce(
    (map, obj) => map.set(obj.date!, obj?.slots!),
    new Map<string, any>()
  );

  const urlMap = venue?.monthlySlots?.reduce(
    (map, obj) => map.set(obj.date!, obj?.url!),
    new Map<string, any>()
  );

  const onDisableDates = (date: Moment): boolean => {
    const entry = dateMap?.get(date.format("YYYY-MM-DD"));
    return !entry || entry?.length === 0;
  };

  const fullCellRender = (dateentry: Moment) => {
    if (onDisableDates(dateentry)) {
      return (
        <div className={"calendar-date-not-available"}>{dateentry.date()}</div>
      );
    }

    if (dateentry.format("YYYY-MM-DD") === selectdDate) {
      return (
        <div className={"calendar-date-box calendar-date-available-today"}>
          {dateentry.date()}
        </div>
      );
    }

    return (
      <div className={"calendar-date-box calendar-date-available"}>
        {dateentry.date()}
      </div>
    );
  };

  return (
    <div className="site-calendar-demo-card">
      <Calendar
        fullscreen={false}
        disabledDate={onDisableDates}
        mode="month"
        dateFullCellRender={fullCellRender}
        defaultValue={moment(date, "YYYY-MM-DD")}
        onSelect={(date) => {
          const ndate: string = date.format("YYYY-MM-DD");
          if (ndate.slice(0, 7) !== selectdDate.slice(0, 7)) {
            setDate(ndate);
            return;
          }
          setSelectedDate(ndate);
        }}
        validRange={[moment().subtract(1, "day"), moment().add(3, "month")]}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          return (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                size="large"
                onClick={() => onChange(value.subtract(1, "month"))}
              />
              <h3>
                {value.format("MMMM")}, {value.format("YYYY")}
              </h3>
              <Button
                shape="circle"
                icon={<RightOutlined />}
                size="large"
                onClick={() => onChange(value.add(1, "month"))}
              />
            </div>
          );
        }}
      />
      <AvailabilityList
        slots={dateMap?.get(selectdDate)!}
        url={urlMap?.get(selectdDate)!}
      />
    </div>
  );
};
