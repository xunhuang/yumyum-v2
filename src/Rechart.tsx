import * as React from "react";
import { BarChart, Bar, XAxis } from "recharts";

type DataItem = {
  name: string;
  value: number;
};

type ChartProps = {
  data: DataItem[];
};

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>ReCharts</h1>
      <BarChart width={200} height={200} data={data} layout="horizontal">
        <Bar dataKey="value" fill="#08d" />
        <XAxis dataKey="name" />
      </BarChart>
    </div>
  );
};

export default Chart;
