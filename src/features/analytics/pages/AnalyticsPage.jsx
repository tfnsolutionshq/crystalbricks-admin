// src/features/analytics/pages/AnalyticsPage.jsx
// Main/list page for the Analytics feature. All page-unique sections
// (header, filter bar, stat cards, charts, donut, key metrics list) are
// built inline here per project convention — only true cross-feature
// atoms are imported from src/components.

import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Download,
  Info,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import FilterPill from "@/shared/components/FilterPill";
import Pagination from "@/shared/components/Pagination";
import formatCurrency from "@/shared/utils/formatCurrency";
import formatNumber from "@/shared/utils/formatNumber";

import { getTrendColorClass } from "@/features/analytics/helpers/analyticsHelpers";

import {
  summaryStats,
  loansVsInvestment,
  loansVsInvestmentTooltip,
  customerGrowth,
  customerGrowthTotal,
  productsBreakdown,
  productsTotalCount,
  keyMetrics,
  analyticsFilters,
  analyticsPagination,
} from "@/features/analytics/mocks/analyticsMockData";
import Layout from "@/shared/components/Layout.jsx";

// ---------------------------------------------------------------------------
// Custom tooltip: Loans vs Investment bar chart
// ---------------------------------------------------------------------------
function BarChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const override = loansVsInvestmentTooltip[label];
  const loansValue = override
    ? override.loans
    : payload.find((p) => p.dataKey === "loans")?.value;
  const investmentValue = override
    ? override.investment
    : payload.find((p) => p.dataKey === "investment")?.value;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-sm min-w-52.5">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      <div className="flex items-center justify-between gap-6 mb-1">
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Loans
        </span>
        <span className="font-medium text-slate-800">
          {formatCurrency(loansValue)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          Investment
        </span>
        <span className="font-medium text-slate-800">
          {formatCurrency(investmentValue)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom tooltip: Customer Growth line chart
// ---------------------------------------------------------------------------
function LineChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-sm min-w-47.5">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
          Active Users
        </span>
        <span className="font-medium text-slate-800">
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom tooltip: Products donut chart
// ---------------------------------------------------------------------------
function DonutTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const slice = payload[0]?.payload;
  if (!slice) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-sm min-w-55">
      <p className="text-slate-500 mb-1">Total {slice.name}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5 text-slate-700">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: slice.color }}
          />
          {slice.count} ({slice.share}%)
        </span>
        <span className="font-semibold text-slate-800">
          {formatCurrency(slice.amount)}
        </span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [page, setPage] = useState(analyticsPagination.page);

  const statIcon = {
    revenue: null,
    customers: null,
    transactions: null,
    loans: null,
  };

  return (
    <Layout activeNavItem="Analytics">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors w-full sm:w-auto"
            >
              Export
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Filter bar                                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <FilterPill label="Date" value={analyticsFilters.date} />
            <FilterPill label="Category" value={analyticsFilters.category} />
            <FilterPill label="Customer Type" value={null} />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Stat cards                                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summaryStats.map((stat) => (
              <div
                key={stat.key}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.isCurrency
                    ? formatCurrency(stat.value)
                    : formatNumber(stat.value)}
                </p>
              </div>
            ))}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Charts row: Loans vs Investment / Customer Growth            */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Loans vs Investment */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-slate-500">
                    Loans vs Investment
                  </h3>
                  <Info className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <DollarSign className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                {formatCurrency(summaryStats[0].value)}
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loansVsInvestment} barCategoryGap="30%">
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      content={<BarChartTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar
                      dataKey="investment"
                      stackId="a"
                      radius={[0, 0, 4, 4]}
                      barSize={22}
                    >
                      {loansVsInvestment.map((entry) => (
                        <Cell
                          key={`inv-${entry.month}`}
                          fill={entry.mutedInvestment ? "#cbd5e1" : "#f87171"}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="loans"
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                      barSize={22}
                    >
                      {loansVsInvestment.map((entry) => (
                        <Cell key={`loan-${entry.month}`} fill="#10b981" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Growth */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-slate-500">
                    Customer Growth
                  </h3>
                  <Info className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <Users className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                {formatNumber(customerGrowthTotal)}
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowth}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      content={<LineChartTooltip />}
                      cursor={{ stroke: "#e2e8f0" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Second row: Products donut / Key Metrics                     */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
            {/* Products donut */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-slate-500">
                    Products
                  </h3>
                  <Info className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <FileText className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-4">
                {productsTotalCount}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-52 w-52 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productsBreakdown}
                        dataKey="share"
                        nameKey="name"
                        innerRadius="65%"
                        outerRadius="100%"
                        paddingAngle={2}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {productsBreakdown.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex sm:flex-col gap-4 sm:gap-3">
                  {productsBreakdown.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Key Metrics
              </h3>
              <div className="space-y-3">
                {keyMetrics.map((metric) => {
                  const TrendIcon =
                    metric.direction === "down" ? TrendingDown : TrendingUp;
                  return (
                    <div
                      key={metric.key}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3.5"
                    >
                      <div>
                        <p className="text-sm text-slate-500 mb-1">
                          {metric.label}
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {metric.isCurrency
                            ? formatCurrency(metric.value, { decimals: 0 })
                            : `${metric.value}${metric.suffix || ""}`}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1 text-sm font-medium ${getTrendColorClass(
                          metric.direction,
                        )}`}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {metric.change}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Footer pagination                                            */}
          {/* ------------------------------------------------------------- */}
          <Pagination
            showing={analyticsPagination.showing}
            total={analyticsPagination.total}
            page={page}
            pages={analyticsPagination.pages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPage((p) => Math.min(analyticsPagination.pages, p + 1))
            }
          />
        </div>
      </div>
    </Layout>
  );
}
