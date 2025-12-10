"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ChartProps {
  data: { time: string; temp: number }[];
}

export default function TwentyFourHourChart({ data }: ChartProps) {
  return (
    <div className="w-full h-72 flex flex-col">

      <h2 className="text-white text-xl font-bold mb-3 tracking-wide drop-shadow">
        24-Hour Temperature Trend
      </h2>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>

            <defs>
              <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4DBBFF" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1A6FFF" stopOpacity={0.15} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.25)"
            />

            <XAxis
              dataKey="time"
              interval={0}                     // show every tick
              tick={{ fill: "white", fontSize: 12 }}
              tickMargin={10}
            />

            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fill: "white", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "10px",
                color: "white",
              }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="#36A2FF"
              strokeWidth={3}
              fill="url(#gradientFill)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
