import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { Chart, LineSpec, RefLineType } from './Chart';
import { DataSeries } from './DataSeries';
import { DateRangeSlider } from './DateRangeSlider';
import { Legend } from './Legend';
import { SectionHeader } from './SectionHeader';

var shortNumber = require("short-number");
const moment = require("moment");

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

const useStyles = makeStyles((theme) => ({
  options: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "16px",
    "& > *": {
      margin: "0 8px 8px 0",
    },
  },
  slider: {
    display: "flex",
    width: 200,
    alignItems: "center",
  },
  expand: {
    flexGrow: 1,
  },
}));

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
};

export const AdvancedGraph = (props: AdvancedGraphProps) => {
  const {
    showControls = true,
    yAxisFormatter = (n: number) => myShortNumber(n),
    subtitle = "",
    className = "",
    initNumberOfDays = 30,
  } = props; // this is how default is set

  const classes = useStyles();

  const [showPastDays, setShowPastDays] = React.useState(initNumberOfDays);

  const handleSliderValueChange = (value: number) => {
    setShowPastDays(value);
  };

  function filterData(data: any[]) {
    const cutoff = moment().subtract(showPastDays, "days").unix();
    const future = moment().add(14, "days").unix();
    return data.filter((p) => p.timestamp >= cutoff && p.timestamp <= future);
  }

  // Expands series that are supposed to have trend lines into an entry for the
  // original series and one for the trend line.
  const expandedSerieses = expandSeriesesToMap(props.serieses);

  // Okay, here's where it gets terrible. We have raw serieses and envelopes.
  // We want the user to be able to toggle serieses and evelopes on and off one
  // by one, but not to toggle the serieses inside of a envelope. So for the
  // purposes of Recharts we're going to decompose the envelopes to be raw
  // serieses. But for our code, we're going to merge them and be confused a
  // lot.

  const allSerieses = [...expandedSerieses.values()];

  let { data, timestampFormatter } = DataSeries.flatten(
    [...allSerieses.values()].map(({ series }) => series)
  );

  const seriesesAndEnvelopes = [...expandedSerieses.entries()];
  const allLabels = seriesesAndEnvelopes.map(([label]) => label);
  const [known, setKnown] = React.useState(allLabels);
  const [selected, setSelected] = React.useState(() =>
    seriesesAndEnvelopes
      // .filter((item) => item[1].initial !== "off")
      .map(([label]) => label)
  );

  // As the user switches pages, graphs that were previously unknown may become
  // available. So turn them off if they default to on when they appear.
  if (known.join() !== allLabels.join()) {
    const add = [];
    for (const [key, { initial }] of seriesesAndEnvelopes) {
      if (
        !known.includes(key) &&
        !selected.includes(key) &&
        initial !== "off"
      ) {
        add.push(key);
      }
    }

    if (add.length > 0) {
      // We might as well just do this in here, even though technically we
      // should probably do it in the else branch too.
      setKnown(allLabels);
      setSelected(selected.concat(add));
    }
  }

  return (
    <div className={className}>
      {props.title && (
        <SectionHeader>
          <Typography variant="h5" noWrap>
            {props.title}
            <Typography variant="body1" noWrap>
              {subtitle}
            </Typography>
          </Typography>
        </SectionHeader>
      )}
      {showControls && (
        <div className={classes.options}>
          <div className={classes.slider}>
            <div>Date:</div>
            <DateRangeSlider
              currentDate={moment()}
              startDate={moment("02/01/2020", "MM/DD/YYYY")}
              valueChanged={handleSliderValueChange}
              defaultValue={showPastDays}
              minOffset={30}
            />
          </div>
          <div className={classes.expand} />
          <Legend
            spec={seriesesAndEnvelopes}
            selected={selected}
            onChange={(a: any) => {
              setSelected(a);
            }}
          />
        </div>
      )}
      <Chart
        data={filterData(data)}
        timestampFormatter={timestampFormatter}
        yAxisFormatter={yAxisFormatter}
        specs={seriesesAndEnvelopes
          .filter(([label]) => selected.includes(label))
          .map(
            ([label, s]) =>
              ({
                label: label,
                color: s.color,
                rightAxis: s.rightAxis,
                derived: s.derived,
                stipple: s.stipple,
              } as LineSpec)
          )}
        vRefLines={props.vRefLines}
        hRefLines={props.hRefLines}
      />
    </div>
  );
};

function expandSeriesesToMap(serieses: GraphSeriesType[]) {
  const expanded = serieses.flatMap((s) => {
    const result = [] as GraphSeriesType[];
    if (s.covidspecial) {
      let s_for_display;
      if (s.showMovingAverage) {
        s_for_display = s.series.nDayAverage(7);
      } else {
        s_for_display = s.series;
      }

      let main = {
        ...s,
        series: s_for_display.dropLastPoint(),
        stipple: false,
      };
      let last = {
        ...s,
        series: s_for_display.last2PointSeries().suffixLabel("*"),
        stipple: true,
        derived: true,
      };
      result.push(main);
      result.push(last);

      if (s.showMovingAverage) {
        let original = {
          ...s,
          series: s.series,
          derived: false,
          stipple: true,
        };
        result.push(original);
      }
    } else {
      result.push(s);
    }
    return result;
  });

  return new Map(
    expanded.map((seriesInfo) => {
      let series = seriesInfo.series;
      let label = "empty";
      if (series) {
        label = series.label();
      }
      return [label, seriesInfo];
    })
  );
}

export function myShortNumber(n: any) {
  if (!n) {
    return "0";
  }
  if (isNaN(n)) {
    n = n.replace(/,/g, "");
    n = Number(n);
  } else if (!isFinite(n)) {
    return "∞";
  }
  return shortNumber(n);
}

export const ExampleGraph = () => (
  <AdvancedGraph
    title="hey graph"
    serieses={[
      {
        series: new DataSeries("hello", [
          [1632891804, 20],
          [1632978204, 50],
          [1633039407, 100],
        ]),
        color: "red",
        // rightAxis: false,
        // covidspecial: true,
        // showMovingAverage: true,
      },
      {
        series: new DataSeries("world", [
          [1632891804, 10],
          [1632978204, 40],
          [1633039407, 110],
        ]),
        color: "blue",
        rightAxis: true,
        // covidspecial: true,
        // showMovingAverage: true,
      },
    ]}
  />
);
