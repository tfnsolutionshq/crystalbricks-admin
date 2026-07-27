import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { REVENUE_BREAKDOWN } from "@/features/dashboard/mocks/dashboardMockData";

export default function RevenueDonutChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1 min-w-55">
      <h3 className="text-base text-gray-500 mb-4">
        Total Revenue:{" "}
        <span className="text-gray-900 font-bold">₦343,209,329.55</span>
      </h3>

      <div className="relative h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={REVENUE_BREAKDOWN}
              dataKey="value"
              innerRadius={72}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              stroke="none"
            >
              {REVENUE_BREAKDOWN.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            ₦205,925,597.73
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        {REVENUE_BREAKDOWN.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
