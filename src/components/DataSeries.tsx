// import { ma } from "moving-averages";
// const moment = require("moment");
import moment, { Moment } from 'moment';

const { linearRegression } = require("simple-statistics");
const ma = require("moving-averages");

type MomentNumber = [Moment, number];
type NumberNumber = [number, number];

const periods = {
  daily: {
    smoothLabel: "d",
    formatter: (moment: Moment) => moment.format("M/D"),
    intervalS: 24 * 60 * 60,
    converter: (data: NumberNumber[]): MomentNumber[] =>
      data
        .map(
          ([timestamp, value]: NumberNumber): MomentNumber => [
            moment.unix(timestamp),
            value,
          ]
        )
        .sort(([a], [b]) => a.diff(b)),
    pointConverter: ([timestamp, value]: NumberNumber): MomentNumber => [
      moment.unix(timestamp),
      value,
    ],
  },
};

const REGRESSION_WINDOW_SIZE = 6;
const SMOOTH_WINDOW_SIZE = 3;

type PeriodType = typeof periods.daily;

/**
 * A data series is a label with a collection of values at specific moments.
 */
export class DataSeries {
  static fromTimestamps(label: string, raw: [NumberNumber]) {
    if (raw.length > 0) {
      return new DataSeries(label, raw, undefined, periods.daily);
    } else {
      return new EmptySeries(label, periods.daily);
    }
  }

  static fromGraphQLQueryNodes(
    label: string,
    data: object[],
    column: string,
    date_column: string = "date"
  ) {
    let raw = [] as NumberNumber[];
    for (const point of data) {
      let date = point[date_column as keyof typeof point];
      let value = point[column as keyof typeof point];
      let ts = moment(date, "YYYY-MM-DD").unix();
      raw.push([ts, value]);
    }
    return new DataSeries(label, raw, undefined, periods.daily);
  }

  static fromDateStr(label: string, data: Map<string, number>) {
    let raw = [];
    for (var key in data) {
      let ts = moment(key, "MM/DD/YYYY").unix();
      let value = data.get(key);
      raw.push([ts, value]);
    }
    return new DataSeries(
      label,
      raw as [NumberNumber],
      undefined,
      periods.daily
    );
  }

  static flatten(serieses: DataSeries[]) {
    const points = new Map();
    const formatters = new Set();

    for (const series of serieses) {
      if (!series) {
        continue;
      }
      formatters.add(series.formatter());

      if (!series.points()) {
        continue;
      }

      for (const [moment, value] of series.points()) {
        const key = moment.unix();
        if (!points.has(key)) {
          points.set(key, {});
        }

        points.get(key)[series.label()] = value;
      }
    }

    if (formatters.size > 1) {
      throw new Error("Multiple formatters are not allowed");
    } else if (formatters.size === 0) {
      throw new Error("No formatter found");
    }
    const formatter = formatters.values().next().value;

    return {
      data: [...points.entries()]
        .sort(([a], [b]) => a - b)
        .map(([timestamp, data]) => ({
          timestamp,
          ...data,
        })),
      timestampFormatter: (timestamp: number) =>
        formatter(moment.unix(timestamp)),
    };
  }

  constructor(
    label: string,
    raw: NumberNumber[] | undefined,
    points: MomentNumber[] | undefined = undefined,
    period: PeriodType = periods.daily
  ) {
    this.label_ = label;
    this.period_ = period;

    if (raw) {
      this.raw_ = raw;
      this.points_ = undefined;
    } else {
      this.points_ = points;
      this.raw_ = raw;
    }

    this.lastPoint_ = undefined;
  }

  label_: string;
  points_: MomentNumber[] | undefined;
  lastPoint_: MomentNumber | undefined;
  raw_: NumberNumber[] | undefined;
  period_: PeriodType;

  label() {
    return this.label_;
  }

  suffixLabel(suffix: string) {
    this.label_ = `${this.label_} ${suffix}`;
    return this;
  }

  formatter() {
    return this.period_.formatter;
  }

  setLabel(label: string) {
    this.label_ = label;
    return this;
  }

  points(): MomentNumber[] {
    if (!this.points_ && this.raw_!.length > 0) {
      this.points_ = this.period_.converter(this.raw_!);
    }
    return this.points_!;
  }

  pointLargerEqualThan(x: number) {
    for (const [m, v] of this.points()) {
      if (v >= x) {
        return [m, v];
      }
    }
    return null;
  }

  /*
  valueByUnixTimestamp(date) {
    if (!this.valueByUnixTimestamp_ && this.raw_.length > 0) {
      this.valueByUnixTimestamp_ = this.raw_.reduce((m, a) => {
        const [ts, v] = a;
        m[ts] = v;
        return m;
      }, {});
    }
    const value = this.valueByUnixTimestamp_[date];
    return value;
  }
  */

  lastPoint() {
    if (!this.lastPoint_ && this.raw_!.length > 0) {
      this.lastPoint_ = this.period_.pointConverter(
        this.raw_![this.raw_!.length - 1]
      );
    }
    return this.lastPoint_;
  }

  lastValue() {
    const last = this.lastPoint();
    return last?.[1];
  }

  change(): DataSeries {
    const name = `New ${this.label_}`;
    this.points(); // To ensure lazy dataseries are loaded
    const entries = this.points();
    if (entries.length < 1) {
      return new EmptySeries(name, this.period_);
    }

    // We often only want to know the change between the last two values, so
    // pregenerate those.
    // Every* series has an implicit first value of 0, because places only show
    // up in the data when they have a case. So account for it.
    //
    // *except for projections
    const secondToLastValue =
      entries.length >= 2 ? entries[entries.length - 2][1] : 0;
    this.lastPoint_ = entries[entries.length - 1];
    const lastChange = this.lastPoint_[1] - secondToLastValue;

    const generator = () => {
      const points = this.points();
      const deltaPoints = [] as MomentNumber[];
      // deltaPoints.push([points[0][0], points[0][1]]);
      for (let i = 1; i < points.length; ++i) {
        deltaPoints.push([
          points[i][0],
          Math.max(0, points[i][1] - points[i - 1][1]),
        ]);
      }
      return deltaPoints;
    };

    return new LazyDataSeries(
      name,
      generator,
      [this.lastPoint_[0], lastChange],
      this.period_
    );
  }

  /**
   * Removes the first point from the series. This is useful for when taking the
   * change of a series that does not start from 0.
   */
  dropFirst() {
    const points = this.points();
    if (!points || points.length < 1) {
      return undefined;
    }

    const dropped = new DataSeries(
      this.label_,
      undefined,
      points.slice(1),
      this.period_
    );
    return dropped;
  }

  last2PointSeries(): DataSeries {
    const points = this.points();
    if (!points || points.length < 2) {
      return new EmptySeries("empty", this.period_);
    }
    const dropped = new DataSeries(
      this.label_,
      undefined,
      [points[points.length - 2], points[points.length - 1]],
      this.period_
    );
    return dropped;
  }

  dropLastPoint(): DataSeries {
    const points = this.points();
    if (!points || points.length < 1) {
      return new EmptySeries(this.label_, this.period_);
    }
    const dropped = new DataSeries(
      this.label_,
      undefined,
      points.slice(0, points.length - 1),
      this.period_
    );

    return dropped;
  }

  divide(inputseries: DataSeries) {
    console.assert(this.points().length === inputseries.points().length);
    const points = this.points();
    const denominator = inputseries.points();

    const result = [] as MomentNumber[];
    for (let i = 0; i < points.length; i++) {
      result.push([points[i][0], points[i][1] / denominator[i][1]]);
    }

    const series = new DataSeries("division", undefined, result, this.period_);
    return series;
  }

  divideByNumber(divisor: number) {
    const points = this.points();
    const result = [] as MomentNumber[];
    for (let i = 0; i < points.length; i++) {
      result.push([points[i][0], points[i][1] / divisor]);
    }
    const series = new DataSeries("division", undefined, result, this.period_);
    return series;
  }

  nDayAverage(MOVING_WIN_SIZE: number): DataSeries {
    const name = `${this.label_} (${MOVING_WIN_SIZE}-${this.period_.smoothLabel} avg)`;
    let points = this.points();
    if (!points) {
      return new EmptySeries(name, this.period_);
    }

    const values = points.map((p) => p[1]);
    let avg = ma.ma(values, MOVING_WIN_SIZE);
    const smoothed = [] as MomentNumber[];

    for (let i = 0; i < points.length; i++) {
      smoothed.push([points[i][0], avg[i]]);
    }

    const series = new DataSeries(name, undefined, smoothed, this.period_);
    return series;
  }

  smooth(): DataSeries {
    const name = `${this.label_} (${SMOOTH_WINDOW_SIZE} ${this.period_.smoothLabel} avg)`;

    const points = this.points();
    if (points.length < SMOOTH_WINDOW_SIZE) {
      return new EmptySeries(name, this.period_);
    }

    const smoothed = [] as MomentNumber[];
    for (let i = SMOOTH_WINDOW_SIZE - 1; i < points.length; ++i) {
      const window = points.slice(i - SMOOTH_WINDOW_SIZE + 1, i + 1);
      const sum = window.reduce((sum, [, v]) => Math.max(v, 0) + sum, 0);
      smoothed.push([points[i][0], sum / SMOOTH_WINDOW_SIZE]);
    }

    const series = new DataSeries(name, undefined, smoothed, this.period_);
    return series;
  }

  sum() {
    let sum = 0;
    for (const [, value] of this.points()) {
      sum += value;
    }
    return sum;
  }

  trend() {
    const points = this.points();
    if (!points || points.length < 8) {
      return undefined;
    }

    const linear = trendFit(
      this.label_,
      points,
      this.period_,
      (v) => v,
      (p) => p
    );
    const log = trendFit(
      this.label_,
      points,
      this.period_,
      (v) => Math.log2(v),
      (p) => Math.exp(p * Math.log(2))
    );

    if (linear.error < log.error) {
      return linear.series;
    } else {
      return log.series;
    }
  }

  today() {
    const last = this.lastPoint();
    if (!last) {
      return undefined;
    }

    return moment().isSame(last[0], "day") ? last[1] : undefined;
  }
}

class EmptySeries extends DataSeries {
  constructor(label: string, period: PeriodType) {
    super(label, [], undefined, period);
  }
}

class LazyDataSeries extends DataSeries {
  constructor(
    label: string,
    generator: () => MomentNumber[],
    lastPoint: MomentNumber,
    period: PeriodType
  ) {
    super(label, undefined, undefined, period);
    this.generator_ = generator;
    this.lastPoint_ = lastPoint;
  }
  generator_: () => MomentNumber[];

  points(): MomentNumber[] {
    if (!this.points_) {
      this.points_ = this.generator_();
    }
    return this.points_;
  }
}

function positiveOrNothing(value: number) {
  return value >= 0 ? value : NaN;
}

function trendFit(
  label: string,
  points: MomentNumber[],
  period: PeriodType,
  valueMapper: (v: number) => number,
  predictionMapper: (v: number) => number
) {
  const { m, b } = linearRegression(
    points
      .slice(-1 - REGRESSION_WINDOW_SIZE, -1)
      .map(([moment, v]: MomentNumber) => [moment.unix(), valueMapper(v)])
  );
  if (isNaN(m) || isNaN(b)) {
    return { series: undefined, error: 9999999999 };
  }

  const trend = new DataSeries(
    `${label} (Trend)`,
    undefined,
    points.map(([moment]: MomentNumber) => [
      moment,
      predictionMapper(positiveOrNothing(m * moment.unix() + b)),
    ]),
    period
  );

  let error = 0;
  for (let i = 0; i < points.length; ++i) {
    const difference = points[i][1] - (trend.points()[i][1] || 0);
    error += difference * difference;
  }

  return { series: trend, error };
}
