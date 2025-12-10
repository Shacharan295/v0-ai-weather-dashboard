<ResponsiveContainer width="100%" height="100%">
  <AreaChart
    data={data}
    margin={{ top: 0, right: 0, bottom: 10, left: 0 }} // ⭐ keeps X-axis inside
  >
    <defs>
      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4DBBFF" stopOpacity={0.9} />
        <stop offset="95%" stopColor="#1A6FFF" stopOpacity={0.25} />
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />

    <XAxis
      dataKey="time"
      interval={0}
      tickMargin={10}
      padding={{ left: 5, right: 5 }}   // ⭐ FIX: last value visible
      axisLine={false}
      tickLine={false}
      stroke="rgba(255,255,255,0.9)"
      style={{ fontSize: "12px" }}
    />

    <YAxis
      domain={[min, max]}
      tickMargin={8}
      padding={{ top: 5, bottom: 0 }}   // ⭐ FIX: values stay inside panel
      axisLine={false}
      tickLine={false}
      stroke="rgba(255,255,255,0.9)"
      style={{ fontSize: "12px" }}
    />

    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(20,40,80,0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.35)",
        color: "white",
      }}
    />

    <Area
      type="monotone"
      dataKey="temp"
      stroke="#4DBBFF"
      strokeWidth={3}
      fill="url(#tempGradient)"
      dot={{ r: 4, fill: "white" }}
      activeDot={{ r: 6 }}
    />
  </AreaChart>
</ResponsiveContainer>
