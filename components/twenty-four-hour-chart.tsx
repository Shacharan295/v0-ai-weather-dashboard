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
  data: { dt: number; temp: number }[];
  timezoneOffset: number;
}

export default function TwentyFourHourChart({
  data,
  timezoneOffset,
}: ChartProps) {
  if (!data || data.length === 0) return null;

  // -------------------------------
  // 1️⃣ Convert dt → local Date
  // -------------------------------
  const today = new Date(
    (Date.now() + timezoneOffset * 1000)
  ).toDateString();

  const todayData = data
    .map((d) => {
      const localDate = new Date((d.dt + timezoneOffset) * 1000);
      return {
        ...d,
        hour: localDate.getHours(),
        dateStr: localDate.toDateString(),
      };
    })
    .filter((d) => d.dateStr === today);

  if (todayData.length === 0) return null;

  // -------------------------------
  // 2️⃣ Smooth for cinematic curve
  // -------------------------------
  const smoothData = todayData.map((d, i, arr) => {
    if (i === 0 || i === arr.length - 1) return d;
    return {
      ...d,
      temp: Number(
        ((arr[i - 1].temp + d.temp + arr[i + 1].temp) / 3).toFixed(1)
      ),
    };
  });

  const temps = smoothData.map((d) => d.temp);
  const minY = Math.floor(Math.min(...temps) - 1);
  const maxY = Math.ceil(Math.max(...temps) + 1);

  return (
    <div className="w-full h-72">
      <h2 className="text-white text-xl font-semibold mb-3">
        Temperature Trend (Today)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={smoothData}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FC3FF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#4FC3FF" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.15)"
            vertical={false}
          />

          <XAxis
            dataKey="hour"
            stroke="rgba(255,255,255,0.8)"
            tickFormatter={(h) =>
              `${String(h).padStart(2, "0")}:00`
            }
          />

          <YAxis
            domain={[minY, maxY]}
            stroke="rgba(255,255,255,0.8)"
            allowDecimals={false}
          />

          <Tooltip
            labelFormatter={(h) => `${h}:00`}
            formatter={(v) => [`${v}°C`, "Temp"]}
            contentStyle={{
              background: "rgba(20,40,80,0.6)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#4FC3FF"
            strokeWidth={3}
            fill="url(#fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
