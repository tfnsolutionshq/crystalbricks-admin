import { useState } from "react";
import { Plus } from "lucide-react";

import Layout from "@/shared/components/Layout";
import StatCard from "@/shared/components/StatCard";
import Pagination from "@/shared/components/Pagination";

import ProductTabs from "@/features/products/components/ProductTabs";
import FilterBar from "@/features/products/components/FilterBar";
import ProductsTable from "@/features/products/components/ProductsTable";

import { DATA_BY_TAB } from "@/features/products/mocks/productsMockData";

export default function Products() {
  const [activeTab, setActiveTab] = useState("fixed-deposits");
  const [search, setSearch] = useState("");

  const { stats, rows, showing, total, page, pageCount } =
    DATA_BY_TAB[activeTab];

  return (
    <Layout activeNavItem="Products">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button
            type="button"
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium pl-4 pr-3 py-2.5 rounded-lg"
          >
            Add product
            <Plus size={16} />
          </button>
        </div>

        <ProductTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-wrap gap-6">
          <StatCard label="Avg Interest Rate" value={stats.avgInterestRate} />
          <StatCard
            label="Total Active Products"
            value={stats.totalActiveProducts}
          />
          <StatCard label="New Signups (FD)" value={stats.newSignups} />
        </div>

        <FilterBar searchValue={search} onSearchChange={setSearch} />

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <ProductsTable rows={rows} />
          <Pagination
            showing={showing}
            total={total}
            page={page}
            pageCount={pageCount}
          />
        </div>
      </div>
    </Layout>
  );
}
