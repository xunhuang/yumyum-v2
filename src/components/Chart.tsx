import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const moment = require("moment");

function valueFormatter(value: any) {
  if (typeof value == "string") {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    return "unknown";
  } else {
    if (value < 1) {
      return (value * 100).toFixed(1) + "%";
    }
    return value.toFixed(1).replace(/\.?0+$/, "");
  }
}

export function specToElements(spec: LineSpec) {
  return [lineForSpec(spec)];
}

function lineForSpec(spec: LineSpec) {
  return (
    <Line
      key={spec.label}
      baseLine={10000}
      type="monotone"
      dataKey={spec.label}
      isAnimationActive={false}
      fill={spec.color}
      stroke={spec.color}
      strokeDasharray={spec.stipple ? "1 2" : undefined}
      dot={false}
      strokeWidth={2}
      yAxisId={spec.rightAxis ? 1 : 0}
    />
  );
}

/*
const useDisplayStyles = makeStyles((theme) => ({
  options: {
    display: "initial",
  },
  option: {
    ...baseToggleButtonStyles,
  },
}));
const Display = (props) => {
  const classes = useDisplayStyles();
  return (
    <ToggleButtonGroup
      exclusive
      value={props.selected}
      onChange={(event, desired) => desired && props.onChange(desired)}
      className={classes.options}
    >
      {[...props.displays.entries()].map(([key, data]) => (
        <ToggleButton key={key} value={key} className={classes.option}>
          {data.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

*/

export interface RefLineType {
  date: number; // unix timestamp
  label: string;
  // value: number;
}
export interface LineSpec {
  derived: boolean;
  label: string;
  color: string;
  stipple: boolean;
  rightAxis: boolean;
}
type ChartProps = {
  vRefLines?: RefLineType[];
  hRefLines?: RefLineType[];
  data: object[];
  specs: LineSpec[];

  timestampFormatter: (timestamp: number) => string;
  yAxisFormatter: (v: number) => string; //  myShortNumber;
};
export const Chart = (props: ChartProps) => {
  const ordered = (props.specs || []).sort((a, b) => {
    if (a.derived && !b.derived) {
      return -1;
    } else if (!a.derived && b.derived) {
      return 1;
    } else {
      return a.label < b.label ? -1 : 1;
    }
  });

  let YAxis0Color = "black";
  let YAxis1Color = undefined;
  for (const s of ordered) {
    if (s.rightAxis) {
      YAxis1Color = s.color;
    } else {
      YAxis0Color = s.color;
    }
  }

  function getvRefLines(lines: RefLineType[]) {
    let result = (lines || []).map((l, idx: number) => {
      return (
        <ReferenceLine
          key={`vrefline${idx}`}
          x={l.date}
          stroke="#e3e3e3"
          strokeWidth={1}
        >
          <Label value={l.label} position={"insideTop"} fill="#b3b3b3" />
        </ReferenceLine>
      );
    });
    return result;
  }

  function getvRefAreas(lines: RefLineType[]) {
    let result = (lines || []).map((l, idx) => {
      const startdate = l.date;
      const today = moment().unix();
      let enddate = startdate + 14 * 24 * 60 * 60;
      while (enddate > today) {
        enddate -= 24 * 60 * 60;
      }
      return (
        <ReferenceArea
          key={`vrefarea${idx}`}
          x1={startdate}
          x2={enddate}
          // stroke="red"
          // strokeOpacity={0.3}
          fillOpacity={0.15}
        />
      );
    });
    return result;
  }

  function gethRefLines(lines: RefLineType[]) {
    let result = (lines || []).map((l, idx) => {
      return (
        <ReferenceLine
          key={`hrefline${idx}`}
          y={l.date}
          stroke="#e3e3e3"
          strokeWidth={1}
        >
          <Label value={l.label} position={"insideLeft"}></Label>
        </ReferenceLine>
      );
    });
    return result;
  }

  return (
    <ResponsiveContainer height={300}>
      <LineChart data={props.data} margin={{ left: -4, right: 8 }}>
        {props.vRefLines && getvRefLines(props.vRefLines)}
        {props.hRefLines && gethRefLines(props.hRefLines)}
        {props.vRefLines && getvRefAreas(props.vRefLines)}
        <Tooltip
          formatter={valueFormatter}
          labelFormatter={props.timestampFormatter}
        />
        <XAxis dataKey="timestamp" tickFormatter={props.timestampFormatter} />
        <YAxis
          yAxisId={0}
          tick={{ fill: YAxis0Color }}
          //   scale={props.scale === "Log" ? logScale : props.scale}
          //   scale={props.scale === "Log" ? logScale : props.scale}
          width={50}
          tickFormatter={props.yAxisFormatter}
        />
        {YAxis1Color && (
          <YAxis
            yAxisId={1}
            tickFormatter={props.yAxisFormatter}
            width={35}
            tick={{ fill: YAxis1Color }}
            orientation="right"
          />
        )}
        <CartesianGrid stroke="#d5d5d5" strokeDasharray="5 5" />

        {ordered.flatMap((spec) => specToElements(spec))}
      </LineChart>
    </ResponsiveContainer>
  );
};
