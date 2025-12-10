"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: { time: string; temp: number }[];
}

export default function TwentyFourHourChart({ data }: ChartProps) {
  if (!data || data.length === 0) return null;

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // ⭐ MAIN FIX: allow blue fill to go below zero
  // –0.32 → –1, –5.1 → –6, –0.01 → –1
  let minY = Math.floor(minTemp - 0.1);

  // ⭐ give breathing room above
  let maxY = Math.ceil(maxTemp + 1);

  // ⭐ prevent flat-looking charts
  if (maxY - minY < 6) {
    maxY = minY + 6;
  }

  // ⭐ EVEN TICKS (always 5 clean steps)
  const ticks = [
    minY,
    minY + (maxY - minY) * 0.25,
    minY + (maxY - minY) * 0.5,
    minY + (maxY - minY) * 0.75,
    maxY,
  ].map((v) => Math.round(v));

  return (
    <div className="w-full h-72 flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-3 tracking-wide">
        24-Hour Temperature Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
        >
          <defs>
            {/* ⭐ FIXED GRADIENT — allows full bottom fill */}
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3EA8FF" stopOpacity={0.9} />
              {/* the old opacity=0.25 caused clipping below 0°C */}
              <stop offset="100%" stopColor="#3EA8FF" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.25)"
          />

          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.9)"
            style={{ fontSize: "13px" }}
            interval={0}
            tickMargin={10}
          />

          <YAxis
            stroke="rgba(255,255,255,0.9)"
            domain={[minY, maxY]}
            ticks={ticks}
            allowDecimals={false}
            style={{ fontSize: "13px" }}
            tickMargin={10}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(20,40,80,0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "10px",
              color: "white",
            }}
            cursor={{ stroke: "white", strokeWidth: 1 }}
          />

          {/* ⭐ FINAL: BLUE WILL ALWAYS FILL ALL THE WAY DOWN */}
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#3EA8FF"
            strokeWidth={3}
            fill="url(#tempFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
