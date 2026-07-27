import { useState } from "react";

import Layout from "@/shared/components/Layout";
import StatCard from "@/shared/components/StatCard";

import FilterDropdown from "@/features/dashboard/components/FilterDropdown";
import ActiveUsersChart from "@/features/dashboard/components/ActiveUsersChart";
import UpcomingRepayments from "@/features/dashboard/components/UpcomingRepayments";
import RevenueDonutChart from "@/features/dashboard/components/RevenueDonutChart";
import RecentTransactionsTable from "@/features/dashboard/components/RecentTransactionsTable";

import { STATS } from "@/features/dashboard/mocks/dashboardMockData";

export default function Dashboard() {
  const [statsFilter] = useState("All stats");
  const [timeFilter] = useState("All time");

  return (
    <Layout activeNavItem="Dashboard">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <FilterDropdown label={statsFilter} />
            <FilterDropdown label={timeFilter} />
          </div>
        </div>

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
      </div>
    </Layout>
  );
}
