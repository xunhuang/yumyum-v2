import moment from 'moment';

import { AdvancedGraph } from './AdvanceGraph';
import { RefLineType } from './Chart';
import { DataSeries } from './DataSeries';

export interface GraphSeriesType {
  series: DataSeries;
  derived?: boolean;
  color?: string;
  rightAxis?: boolean;
  covidspecial?: boolean;
  showMovingAverage?: boolean;
  stipple?: boolean;
  initial?: string;
}

type AdvancedGraphProps = {
  serieses: GraphSeriesType[];
  title: string;
  yAxisFormatter?: (v: number) => string; //  myShortNumber;
  subtitle?: string;
  className?: string;
  showControls?: boolean;
  vRefLines?: RefLineType[];
  hRefLines?: RefLineType[];
  initNumberOfDays?: number;
  showHolidays?: boolean;
};

const unixMMDDYYYY = (date: string) => moment(date, "MM/DD/YYYY").unix();

export function getRefDates(): RefLineType[] {
  const vKeyRefLines = [
    {
      date: unixMMDDYYYY("05/25/2020"),
      label: "Memorial",
    },
    {
      date: unixMMDDYYYY("07/04/2020"),
      label: "July 4th",
    },
    {
      date: unixMMDDYYYY("09/07/2020"),
      label: "Labor Day",
    },
    {
      date: unixMMDDYYYY("11/26/2020"),
      label: "Thanksgiving",
    },
    {
      date: unixMMDDYYYY("12/25/2020"),
      label: "XMas",
    },
    {
      date: unixMMDDYYYY("01/01/2021"),
      label: "New Year",
    },
    {
      date: unixMMDDYYYY("02/15/2021"),
      label: "President's Day",
    },
    {
      date: unixMMDDYYYY("01/18/2021"),
      label: "MLK",
    },
    {
      date: unixMMDDYYYY("07/04/2021"),
      label: "July 4th",
    },
    {
      date: unixMMDDYYYY("09/06/2021"),
      label: "Labor Day",
    },
    {
      date: unixMMDDYYYY("12/25/2021"),
      label: "XMas",
    },
  ];

  return vKeyRefLines;
}

export const AdvancedCovidGraph = (props: AdvancedGraphProps) => {
  const { showHolidays = true } = props;
  return (
    <AdvancedGraph
      vRefLines={showHolidays ? getRefDates() : undefined}
      {...props}
    />
  );
};
