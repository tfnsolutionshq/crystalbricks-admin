import { useState } from "react";

import Layout from "@/shared/components/Layout";
import StatCard from "@/shared/components/StatCard";
import FilterDropdown from "@/shared/components/FilterDropdown";

import ActiveUsersChart from "@/features/dashboard/components/ActiveUsersChart";
import ActiveEngagementChart from "@/features/dashboard/components/ActiveEngagementChart";
import UpcomingRepayments from "@/features/dashboard/components/UpcomingRepayments";
import RevenueDonutChart from "@/features/dashboard/components/RevenueDonutChart";
import RecentTransactionsTable from "@/features/dashboard/components/RecentTransactionsTable";
import RecentInvestments from "@/features/dashboard/components/RecentInvestments";

import {
  STATS,
  STATS_INVESTMENT,
  STATS_LOANS,
  STATS_FILTER_OPTIONS,
  TIME_FILTER_OPTIONS,
  ACTIVE_SAVING_USERS,
  ACTIVE_LOAN_USERS,
  RECENT_INVESTMENTS,
} from "@/features/dashboard/mocks/dashboardMockData";

export default function Dashboard() {
  const [statsFilter, setStatsFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("allTime");

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
            <UpcomingRepayments />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-wrap gap-6">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6 items-stretch">
          <ActiveUsersChart />
          <UpcomingRepayments />
        </div>
        <div className="flex flex-wrap gap-6 items-stretch">
          <RevenueDonutChart />
          <RecentTransactionsTable />
        </div>
      </>
    );
  };

  return (
    <Layout activeNavItem="Dashboard">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <FilterDropdown
              options={STATS_FILTER_OPTIONS}
              selected={statsFilter}
              onSelect={setStatsFilter}
            />
            <FilterDropdown
              options={TIME_FILTER_OPTIONS}
              selected={timeFilter}
              onSelect={setTimeFilter}
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </Layout>
  );
}
