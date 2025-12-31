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

  // --------------------------------------------------
  // 1️⃣ Convert to local time
  // --------------------------------------------------
  const localData = data.map((d) => {
    const local = new Date((d.dt + timezoneOffset) * 1000);
    return {
      ...d,
      hour: local.getHours(),
      dateStr: local.toDateString(),
    };
  });

  const nowLocal = new Date(Date.now() + timezoneOffset * 1000);
  const todayStr = nowLocal.toDateString();

  // --------------------------------------------------
  // 2️⃣ Split today vs past
  // --------------------------------------------------
  const todayPoints = localData.filter(
    (d) => d.dateStr === todayStr && d.hour >= nowLocal.getHours()
  );

  const pastPoints = localData.filter(
    (d) => d.dateStr !== todayStr || d.hour < nowLocal.getHours()
  );

  // --------------------------------------------------
  // 3️⃣ Build EXACTLY 8 points
  // --------------------------------------------------
  let chartBase: typeof localData = [];

  if (todayPoints.length >= 8) {
    chartBase = todayPoints.slice(0, 8);
  } else {
    const needed = 8 - todayPoints.length;
    const filler = pastPoints.slice(-needed);
    chartBase = [...filler, ...todayPoints];
  }

  const chartData = chartBase.slice(-8);

  // --------------------------------------------------
  // 4️⃣ Smooth curve (unchanged)
  // --------------------------------------------------
  const smoothData = chartData.map((d, i, arr) => {
    if (i === 0 || i === arr.length - 1) return d;
    return {
      ...d,
      temp: Number(
        ((arr[i - 1].temp + d.temp + arr[i + 1].temp) / 3).toFixed(1)
      ),
    };
  });

  // --------------------------------------------------
  // 5️⃣ Y-axis: 6 ticks, dynamic range
  // --------------------------------------------------
  const temps = smoothData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  const padding = 1;
  const minY = Math.floor(minTemp - padding);
  const maxY = Math.ceil(maxTemp + padding);

  const step = Math.max(1, Math.round((maxY - minY) / 5));
  const yTicks = Array.from({ length: 6 }, (_, i) => minY + i * step);

  return (
    <div className="w-full h-72 flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-3">
        Temperature Trend (Today)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={smoothData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3EA8FF" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#3EA8FF" stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.15)"
            vertical={false}
          />

          {/* X-AXIS */}
          <XAxis
            dataKey="hour"
            interval={0}
            tickMargin={8}
            stroke="rgba(255,255,255,0.85)"
            tickFormatter={(h) => {
              const hour12 = h % 12 || 12;
              const ampm = h < 12 ? "AM" : "PM";
              return `${hour12} ${ampm}`;
            }}
          />

          {/* Y-AXIS */}
          <YAxis
            domain={[minY, maxY]}
            ticks={yTicks}
            allowDecimals={false}
            stroke="rgba(255,255,255,0.85)"
            width={40}
          />

          <Tooltip
            labelFormatter={(h) => {
              const hour12 = h % 12 || 12;
              const ampm = h < 12 ? "AM" : "PM";
              return `${hour12} ${ampm}`;
            }}
            formatter={(v) => [`${v}°C`, "Temp"]}
            contentStyle={{
              backgroundColor: "rgba(20,40,80,0.65)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
            }}
          />

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
