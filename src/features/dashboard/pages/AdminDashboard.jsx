import { useState, useEffect } from "react";
import { Wallet, Repeat, Server, Users } from "lucide-react";

import Layout from "@/shared/components/Layout";
import StatCard from "@/shared/components/StatCard";
import FilterDropdown from "@/shared/components/FilterDropdown";

import ActiveUsersChart from "@/features/dashboard/components/ActiveUsersChart";
import ActiveEngagementChart from "@/features/dashboard/components/ActiveEngagementChart";
import UpcomingRepayments from "@/features/dashboard/components/UpcomingRepayments";
import RevenueDonutChart from "@/features/dashboard/components/RevenueDonutChart";
import RecentTransactionsTable from "@/features/dashboard/components/RecentTransactionsTable";
import RecentInvestments from "@/features/dashboard/components/RecentInvestments";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatNumber from "@/shared/utils/formatNumber";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import { fetchDashboard } from "@/features/dashboard/api/dashboardApi.js";

import {
  STATS_INVESTMENT,
  STATS_LOANS,
  ACTIVE_SAVING_USERS,
  ACTIVE_LOAN_USERS,
  RECENT_INVESTMENTS,
  TIME_FILTER_OPTIONS,
} from "@/features/dashboard/mocks/dashboardMockData";

const STATUS_LABELS = {
  success: "Completed",
  pending: "Pending",
  failed: "Failed",
};

const STAT_ICONS = {
  revenue: Wallet,
  transactions: Repeat,
  assets: Server,
  customers: Users,
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsFilter, setStatsFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all_time");

  useEffect(() => {
    setLoading(true);
    fetchDashboard(dateFilter)
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
  }, [dateFilter]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    fetchDashboard(dateFilter)
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

  const summary = data?.summary;
  const revenueBreakdown = data?.revenue_breakdown ?? {};
  const breakdownData = [
    {
      name: "Loans",
      value: revenueBreakdown.loans ?? 0,
      color: "#2563eb",
    },
    {
      name: "Contributions",
      value: revenueBreakdown.investments ?? 0,
      color: "#60a5fa",
    },
  ].filter((entry) => entry.value > 0);

  const statCards = [
    {
      label: "Total Revenue",
      value: summary ? formatCurrency(summary.total_revenue) : "₦0.00",
      icon: STAT_ICONS.revenue,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      label: "Total Transactions",
      value: summary ? formatNumber(summary.total_transactions) : "0",
      icon: STAT_ICONS.transactions,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "Assets Managed",
      value: summary ? formatNumber(summary.assets_managed) : "0",
      icon: STAT_ICONS.assets,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
    },
    {
      label: "Active Customers",
      value: summary ? formatNumber(summary.active_customers) : "0",
      icon: STAT_ICONS.customers,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  const activeUsersGrowth = (data?.active_users_growth ?? []).map((entry) => ({
    month: entry.month,
    sessions: entry.count,
  }));
  const activeUsersTotal = activeUsersGrowth.reduce(
    (sum, entry) => sum + entry.sessions,
    0,
  );
  const highlightMonth = activeUsersGrowth.length
    ? activeUsersGrowth[activeUsersGrowth.length - 1].month
    : null;

  const upcomingRepayments = (data?.upcoming_repayments ?? []).map(
    (repayment) => ({
      id: repayment.loan_id,
      due:
        repayment.days_until_due === 0
          ? "Due today"
          : `Due in ${repayment.days_until_due} days`,
      name: repayment.customer_name ?? "N/A",
      date: formatDateTime(repayment.due_date),
      amount: formatCurrency(repayment.amount_due),
    }),
  );

  const recentTransactions = data?.recent_transactions ?? [];

  const renderContent = () => {
    if (statsFilter === "investment") {
      return (
        <>
          <div className="flex flex-wrap gap-6">
            {STATS_INVESTMENT.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-6 items-stretch">
            <ActiveEngagementChart {...ACTIVE_SAVING_USERS} />
            <RecentInvestments investments={RECENT_INVESTMENTS} />
          </div>
        </>
      );
    }

    if (statsFilter === "loans") {
      return (
        <>
          <div className="flex flex-wrap gap-6">
            {STATS_LOANS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-6 items-stretch">
            <ActiveEngagementChart {...ACTIVE_LOAN_USERS} />
            <UpcomingRepayments repayments={upcomingRepayments} />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-wrap gap-6">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6 items-stretch">
          <ActiveUsersChart
            data={activeUsersGrowth}
            value={formatNumber(activeUsersTotal)}
            highlightMonth={highlightMonth}
          />
          <UpcomingRepayments repayments={upcomingRepayments} />
        </div>
        <div className="flex flex-wrap gap-6 items-stretch">
          <RevenueDonutChart
            data={breakdownData}
            total={formatCurrency(
              revenueBreakdown.total ?? summary?.total_revenue,
            )}
          />
          <RecentTransactionsTable
            transactions={recentTransactions}
            dateFilter={dateFilter}
          />
        </div>
      </>
    );
  };

  return (
    <Layout activeNavItem="Dashboard">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <FilterDropdown
              options={TIME_FILTER_OPTIONS}
              selected={dateFilter}
              onSelect={setDateFilter}
            />
          </div>

          {error ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <p className="text-sm text-gray-500 mb-3">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-6">
                {statCards.map((s) => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    value={
                      <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
                    }
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-6 items-stretch">
                <div className="bg-white rounded-2xl border border-gray-100 flex-[1.6] min-w-[320px] h-96 p-6 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-8" />
                  <div className="flex items-end gap-4 h-56">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gray-200 rounded"
                        style={{ height: `${40 + ((i * 13) % 50)}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 flex-1 min-w-55 h-96 p-6 animate-pulse">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-6 items-stretch">
                <div className="bg-white rounded-2xl border border-gray-100 flex-1 min-w-55 h-80 p-6 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-8" />
                  <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 flex-[1.6] min-w-[320px] h-80 p-6 animate-pulse">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 mb-5"
                    >
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </Layout>
  );
}
