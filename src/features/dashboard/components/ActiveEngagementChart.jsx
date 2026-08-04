import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Info, Users } from "lucide-react";

export default function ActiveEngagementChart({ title, value, data }) {
  const chartData = data.map((v, i) => ({ month: i, value: v }));

  return (
    <div className="flex-1 min-w-100 bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-900">{title}</span>
          <Info size={15} className="text-gray-400" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <Users size={16} className="text-gray-500" />
        </div>
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-4">{value}</div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#16A34A"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
        <span>Jan</span>
        <span>Dec</span>
      </div>
    </div>
  );
}
