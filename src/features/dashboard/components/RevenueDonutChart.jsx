import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import formatCurrency from "@/shared/utils/formatCurrency";

export default function RevenueDonutChart({ data = [], total = "₦0.00" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1 min-w-55">
      <h3 className="text-base text-gray-500 mb-4">
        Total Revenue: <span className="text-gray-900 font-bold">{total}</span>
      </h3>

      <div className="relative h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={72}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 mt-2">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex flex-col sm:flex-row sm:items-center items-center gap-1 sm:gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
