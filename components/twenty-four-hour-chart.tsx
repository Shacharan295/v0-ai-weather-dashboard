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

  // -------------------------------
  // CLEAN, EVEN Y-AXIS
  // -------------------------------
  const temps = data.map((d) => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);

  // Expand small ranges to avoid ugly flat charts
  let minY = Math.floor(min) - 1;
  let maxY = Math.ceil(max) + 1;
  if (maxY - minY < 6) {
    maxY = minY + 6;
  }

  // Even 5 ticks (clean spacing)
  const step = (maxY - minY) / 4;
  const ticks = Array.from({ length: 5 }, (_, i) =>
    Math.round(minY + i * step)
  );

  return (
    <div className="w-full h-72 flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-3 tracking-wide">
        24-Hour Temperature Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
        >
          {/* BLUE fills fully to bottom */}
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3EA8FF" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3EA8FF" stopOpacity={0.25} />
            </linearGradient>
          </defs>

          {/* clean grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.25)"
          />

          {/* X-axis */}
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.9)"
            style={{ fontSize: "13px" }}
            interval={0}
            tickMargin={10}
          />

          {/* Y-axis evenly spaced */}
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

          {/* The area line */}
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
