import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

export default function ActiveUsersChart({
  data = [],
  value = 0,
  highlightMonth = null,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-[1.6] min-w-[320px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Active Users Growth
          </h3>
          <p className="text-sm text-gray-500">
            Daily active user sessions over the last 12 months
          </p>
        </div>
        <span className="text-2xl font-bold text-gray-900 shrink-0 ml-4">
          {value}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
            {highlightMonth && <ReferenceLine x={highlightMonth} stroke="#e5e7eb" />}
            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white border border-gray-200 shadow-md rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800">
                    {payload[0].value}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#8b5cf6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
