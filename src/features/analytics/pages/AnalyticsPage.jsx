// src/features/analytics/pages/AnalyticsPage.jsx
// Main/list page for the Analytics feature. All page-unique sections
// (header, stat cards, charts, donut, key metrics list) are built inline
// here per project convention — only true cross-feature atoms are imported
// from src/components. Data is loaded from the /admin/analytics endpoint.

import { useState, useEffect } from "react";
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
import { Download, Info, DollarSign, Users, FileText } from "lucide-react";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatNumber from "@/shared/utils/formatNumber";
import { formatPercent } from "@/features/analytics/helpers/analyticsHelpers";

import { fetchAnalytics } from "@/features/analytics/api/analyticsApi.js";
import Layout from "@/shared/components/Layout.jsx";

// ---------------------------------------------------------------------------
// Custom tooltip: Loans vs Investment bar chart
// ---------------------------------------------------------------------------
function BarChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const loansValue = payload.find((p) => p.dataKey === "loans")?.value ?? 0;
  const investmentValue =
    payload.find((p) => p.dataKey === "investment")?.value ?? 0;

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
          Customers
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

const EMPTY_CHARTS = {
  loans_vs_investments: [],
  customer_growth: [],
  products: {
    fixed_deposits: { count: 0, amount: 0 },
    loans: { count: 0, amount: 0 },
  },
};

const EMPTY_KEY_METRICS = {
  average_transaction_value: 0,
  loan_default_rate: 0,
  average_deposit_amount: 0,
};

function buildSummary(summary = {}) {
  return [
    {
      key: "revenue",
      label: "Total Revenue",
      value: summary.total_revenue ?? 0,
      isCurrency: true,
    },
    {
      key: "customers",
      label: "Active Customers",
      value: summary.active_customers ?? 0,
      isCurrency: false,
    },
    {
      key: "transactions",
      label: "Transactions",
      value: summary.total_transactions ?? 0,
      isCurrency: false,
    },
    {
      key: "loans",
      label: "Active Loans",
      value: summary.active_loans ?? 0,
      isCurrency: false,
    },
  ];
}

function buildLoansVsInvestment(charts = EMPTY_CHARTS) {
  return (charts.loans_vs_investments ?? []).map((entry) => ({
    month: entry.month,
    loans: entry.loans ?? 0,
    investment: entry.investment ?? 0,
  }));
}

function buildCustomerGrowth(charts = EMPTY_CHARTS) {
  return (charts.customer_growth ?? []).map((entry) => ({
    month: entry.month,
    count: entry.count ?? 0,
  }));
}

function buildProducts(charts = EMPTY_CHARTS) {
  const products = charts.products ?? EMPTY_CHARTS.products;
  const breakdown = [
    {
      key: "fixedDeposits",
      name: "Contributions",
      color: "#0d9f6e",
      count: products.fixed_deposits?.count ?? 0,
      amount: products.fixed_deposits?.amount ?? 0,
    },
    {
      key: "loans",
      name: "Loans",
      color: "#0f172a",
      count: products.loans?.count ?? 0,
      amount: products.loans?.amount ?? 0,
    },
  ];

  const totalAmount = breakdown.reduce((sum, p) => sum + p.amount, 0);
  breakdown.forEach((p) => {
    p.share = totalAmount ? Math.round((p.amount / totalAmount) * 100) : 0;
  });

  return {
    breakdown,
    totalCount: breakdown.reduce((sum, p) => sum + p.count, 0),
  };
}

function buildKeyMetrics(keyMetrics = EMPTY_KEY_METRICS) {
  return [
    {
      key: "avgTransaction",
      label: "Average Transaction Value",
      value: keyMetrics.average_transaction_value ?? 0,
      isCurrency: true,
    },
    {
      key: "defaultRate",
      label: "Loan Default Rate",
      value: keyMetrics.loan_default_rate ?? 0,
      isPercent: true,
    },
    {
      key: "avgDeposit",
      label: "Average Deposit Amount",
      value: keyMetrics.average_deposit_amount ?? 0,
      isCurrency: true,
    },
  ];
}

function ChartSkeleton() {
  return <div className="h-56 rounded-xl bg-slate-100 animate-pulse" />;
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics()
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ?? err.message ?? "An error occurred",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleRetry() {
    setLoading(true);
    setError(null);
    fetchAnalytics()
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ?? err.message ?? "An error occurred",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const summary = buildSummary(data?.summary);
  const loansVsInvestment = buildLoansVsInvestment(data?.charts);
  const customerGrowth = buildCustomerGrowth(data?.charts);
  const customerGrowthTotal = customerGrowth.reduce(
    (sum, entry) => sum + entry.count,
    0,
  );
  const products = buildProducts(data?.charts);
  const keyMetrics = buildKeyMetrics(data?.key_metrics);

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

          {error ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
              <p className="text-sm text-slate-500 mb-3">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* --------------------------------------------------------- */}
              {/* Stat cards                                               */}
              {/* --------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {summary.map((stat) => (
                  <div
                    key={stat.key}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                  >
                    <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                    {loading ? (
                      <span className="h-7 w-24 bg-slate-200 rounded animate-pulse inline-block" />
                    ) : (
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.isCurrency
                          ? formatCurrency(stat.value)
                          : formatNumber(stat.value)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* --------------------------------------------------------- */}
              {/* Charts row: Loans vs Investment / Customer Growth        */}
              {/* --------------------------------------------------------- */}
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
                    {loading ? (
                      <span className="h-7 w-28 bg-slate-200 rounded animate-pulse inline-block" />
                    ) : (
                      formatCurrency(summary[0].value)
                    )}
                  </p>
                  {loading ? (
                    <ChartSkeleton />
                  ) : (
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
                              <Cell key={`inv-${entry.month}`} fill="#f87171" />
                            ))}
                          </Bar>
                          <Bar
                            dataKey="loans"
                            stackId="a"
                            radius={[4, 4, 0, 0]}
                            barSize={22}
                          >
                            {loansVsInvestment.map((entry) => (
                              <Cell
                                key={`loan-${entry.month}`}
                                fill="#10b981"
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
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
                    {loading ? (
                      <span className="h-7 w-16 bg-slate-200 rounded animate-pulse inline-block" />
                    ) : (
                      formatNumber(customerGrowthTotal)
                    )}
                  </p>
                  {loading ? (
                    <ChartSkeleton />
                  ) : (
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
                            dataKey="count"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* --------------------------------------------------------- */}
              {/* Second row: Products donut / Key Metrics                 */}
              {/* --------------------------------------------------------- */}
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
                    {loading ? (
                      <span className="h-7 w-16 bg-slate-200 rounded animate-pulse inline-block" />
                    ) : (
                      products.totalCount
                    )}
                  </p>

                  {loading ? (
                    <div className="h-52 rounded-xl bg-slate-100 animate-pulse" />
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="h-52 w-52 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={products.breakdown}
                              dataKey="share"
                              nameKey="name"
                              innerRadius="65%"
                              outerRadius="100%"
                              paddingAngle={2}
                              startAngle={90}
                              endAngle={-270}
                            >
                              {products.breakdown.map((entry) => (
                                <Cell key={entry.key} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<DonutTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex sm:flex-col gap-4 sm:gap-3">
                        {products.breakdown.map((entry) => (
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
                  )}
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Key Metrics
                  </h3>
                  <div className="space-y-3">
                    {keyMetrics.map((metric) => (
                      <div
                        key={metric.key}
                        className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3.5"
                      >
                        <div>
                          <p className="text-sm text-slate-500 mb-1">
                            {metric.label}
                          </p>
                          {loading ? (
                            <span className="h-5 w-24 bg-slate-200 rounded animate-pulse inline-block" />
                          ) : (
                            <p className="text-lg font-bold text-slate-900">
                              {metric.isCurrency
                                ? formatCurrency(metric.value, {
                                    decimals: 0,
                                  })
                                : formatPercent(metric.value)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
