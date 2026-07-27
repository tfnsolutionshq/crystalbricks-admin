import { useState } from "react";
import Layout from "@/shared/components/DashboardComponents/Layout.jsx";
import RateConfigTabs from "@/features/rate-config/components/RateConfigTabs";
import FilterBar from "@/features/rate-config/components/FilterBar";
import RateConfigTable from "@/features/rate-config/components/RateConfigTable";
import TableFooter from "@/features/rate-config/components/TableFooter";
import { RATE_PRODUCTS } from "@/features/rate-config/mocks/rateConfigMockData";

export default function RateConfiguration() {
  const [activeTab, setActiveTab] = useState("contributions");
  const [search, setSearch] = useState("");

  return (
    <Layout activeNavItem="Rate Config">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <h1 className="text-2xl font-bold text-gray-900">Rate Configuration</h1>

        <RateConfigTabs activeTab={activeTab} onChange={setActiveTab} />

        <FilterBar searchValue={search} onSearchChange={setSearch} />

        <RateConfigTable rows={RATE_PRODUCTS} />

        <TableFooter showing={10} total={4523} page={1} pageCount={46} />
      </div>
    </Layout>
  );
}
