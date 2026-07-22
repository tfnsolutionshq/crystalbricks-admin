import { useState } from "react";
import { ChevronDown, Wallet, Repeat, Server } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "@/shared/components/DashboardComponents/Layout.jsx";

/* -------------------------------------------------------------------------- */
/* Dummy data                                                                  */
/* -------------------------------------------------------------------------- */

const STATS = [
  {
    label: "Total Revenue",
    value: "\u20a6343,209,329.55",
    icon: Wallet,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    label: "Total Transactions",
    value: "8,421",
    icon: Repeat,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    label: "Assets Managed",
    value: "1,329",
    icon: Server,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
];

const ACTIVE_USERS_DATA = [
  { month: "JAN", sessions: 180 },
  { month: "FEB", sessions: 130 },
  { month: "MAR", sessions: 260 },
  { month: "APR", sessions: 195 },
  { month: "MAY", sessions: 300 },
  { month: "JUN", sessions: 250 },
  { month: "JUL", sessions: 280 },
  { month: "AUG", sessions: 300 },
  { month: "SEP", sessions: 170 },
  { month: "OCT", sessions: 120 },
  { month: "NOV", sessions: 210 },
  { month: "DEC", sessions: 290 },
];

const REPAYMENTS = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  name: "Olamilekan Adams",
  due: "Due in 2 days",
  date: "Apr 9, 2025",
  amount: "\u20a614,054.25",
}));

const REVENUE_BREAKDOWN = [
  { name: "Loans", value: 65, color: "#2563eb" },
  { name: "Invertments", value: 35, color: "#60a5fa" },
];

const TRANSACTIONS = [
  {
    id: "dpt_jkfn32ke3o",
    customer: "Olamilekan Adams",
    amount: "\u20a650,000.00",
    date: "Apr 10, 2025 12:34 PM",
    status: "Completed",
  },
  {
    id: "trf_f53wkek332",
    customer: "Kio Ogan",
    amount: "\u20a620,000.00",
    date: "Apr 7, 2025 10:12 AM",
    status: "Pending",
  },
  {
    id: "trf_f03wfei42",
    customer: "Fiyinfolu Tubonimi",
    amount: "\u20a620,000.00",
    date: "Mar 30, 2025 1:47 PM",
    status: "Failed",
  },
  {
    id: "lon_4kr43fei42",
    customer: "Ogechi Kanu",
    amount: "\u20a625,000.00",
    date: "Mar 21, 2025 1:09 PM",
    status: "Completed",
  },
  {
    id: "trf_9k3fei4321",
    customer: "Chidera Obi",
    amount: "\u20a615,500.00",
    date: "Mar 18, 2025 9:42 AM",
    status: "Completed",
  },
];

/* -------------------------------------------------------------------------- */
/* Small shared bits                                                           */
/* -------------------------------------------------------------------------- */

function FilterDropdown({ label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
    >
      {label}
      <ChevronDown size={16} />
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-gray-100 text-gray-500",
    Failed: "bg-red-50 text-red-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Card: Stat                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 min-w-55">
      <div
        className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-6`}
      >
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card: Active Users Growth (line chart)                                      */
/* -------------------------------------------------------------------------- */

function ActiveUsersChart() {
  const highlightMonth = "AUG";

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
          24,500
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ACTIVE_USERS_DATA}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
            <ReferenceLine x={highlightMonth} stroke="#e5e7eb" />
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

/* -------------------------------------------------------------------------- */
/* Card: Upcoming Repayments                                                   */
/* -------------------------------------------------------------------------- */

function UpcomingRepayments() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1 min-w-55">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        Upcoming Repayments
      </h3>
      <ul className="space-y-3">
        {REPAYMENTS.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-xs text-gray-400 mb-1">{r.due}</p>
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
            </div>
            <span className="text-sm font-bold text-gray-900">{r.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card: Revenue breakdown (donut chart)                                       */
/* -------------------------------------------------------------------------- */

function RevenueDonutChart() {
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

/* -------------------------------------------------------------------------- */
/* Card: Recent Transactions (table)                                          */
/* -------------------------------------------------------------------------- */

function RecentTransactionsTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-[1.6] min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">
          Recent Transactions
        </h3>
        <button
          type="button"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          See all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400">
              <th className="font-medium pb-3 pr-4">Transaction ID</th>
              <th className="font-medium pb-3 pr-4">Customer</th>
              <th className="font-medium pb-3 pr-4">Amount</th>
              <th className="font-medium pb-3 pr-4">Date</th>
              <th className="font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {TRANSACTIONS.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="py-3 pr-4 text-gray-600">{t.id}</td>
                <td className="py-3 pr-4 text-gray-900 font-medium underline decoration-gray-300 underline-offset-2">
                  {t.customer}
                </td>
                <td className="py-3 pr-4 text-gray-900">{t.amount}</td>
                <td className="py-3 pr-4 text-gray-500">{t.date}</td>
                <td className="py-3">
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const [statsFilter] = useState("All stats");
  const [timeFilter] = useState("All time");

  return (
    <Layout activeNavItem="Dashboard">
      <div className="p-6 space-y-6 max-w-[1600px]">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <FilterDropdown label={statsFilter} />
            <FilterDropdown label={timeFilter} />
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-6">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Growth chart + repayments */}
        <div className="flex flex-wrap gap-6 items-stretch">
          <ActiveUsersChart />
          <UpcomingRepayments />
        </div>

        {/* Revenue donut + recent transactions */}
        <div className="flex flex-wrap gap-6 items-stretch">
          <RevenueDonutChart />
          <RecentTransactionsTable />
        </div>
      </div>
    </Layout>
  );
}
