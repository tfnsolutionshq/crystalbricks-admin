import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "@/shared/components/DashboardComponents/Layout";

/* -------------------------------------------------------------------------- */
/* Dummy data                                                                  */
/* -------------------------------------------------------------------------- */

const TABS = [
  { key: "fixed-deposits", label: "Fixed Deposits" },
  { key: "loans", label: "Loans" },
];

const DATA_BY_TAB = {
  loans: {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 1,
      newSignups: 142,
    },
    rows: Array.from({ length: 6 }).map((_, i) => ({
      id: `loan-${i}`,
      name: "Government Salary Workers Loan",
      type: "Individual",
      rate: "20%",
      status: "Active",
      dateCreated: "Apr 10, 2025 12:32 PM",
    })),
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
  "fixed-deposits": {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 3,
      newSignups: 142,
    },
    rows: [
      {
        id: "fd-1",
        name: "SmartSaver Plan",
        type: "Individual",
        rate: "12%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-2",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-3",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-4",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-5",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-6",
        name: "Diaspora Delight Plan",
        type: "Individual",
        rate: "10%",
        status: "Inactive",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
    ],
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
};

/* -------------------------------------------------------------------------- */
/* Small shared bits                                                          */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600",
    Inactive: "bg-red-50 text-red-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DropdownButton({ label, value }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-2.5 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-500">{label}</span>
      {value && (
        <span className="bg-gray-900 text-white text-xs font-medium px-2 py-0.5 rounded-md">
          {value}
        </span>
      )}
      {!value && (
        <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
          <Plus size={11} />
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Card: Stat                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 min-w-55">
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                        */
/* -------------------------------------------------------------------------- */

function ProductTabs({ activeTab, onChange }) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`pb-3 text-sm font-medium -mb-px border-b-2 transition-colors ${
              isActive
                ? "text-gray-900 border-gray-900"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter bar (search + created/type/status filters)                          */
/* -------------------------------------------------------------------------- */

function FilterBar({ searchValue, onSearchChange }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="relative flex-1 min-w-60 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product"
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <DropdownButton label="Created" />
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-1 py-1 text-sm bg-white">
          <span className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md">
            This week
          </span>
        </div>
        <DropdownButton label="Type" />
        <DropdownButton label="Status" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table                                                                       */
/* -------------------------------------------------------------------------- */

function ProductsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="font-medium pb-3 pr-4">Name</th>
            <th className="font-medium pb-3 pr-4">Type</th>
            <th className="font-medium pb-3 pr-4">Rate</th>
            <th className="font-medium pb-3 pr-4">Status</th>
            <th className="font-medium pb-3">Date created</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50">
              <td className="py-4 pr-4 text-gray-900 font-semibold max-w-55 truncate">
                {row.name}
              </td>
              <td className="py-4 pr-4 text-gray-500">{row.type}</td>
              <td className="py-4 pr-4 text-gray-900">{row.rate}</td>
              <td className="py-4 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4 text-gray-500">{row.dateCreated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination footer                                                          */
/* -------------------------------------------------------------------------- */

function TableFooter({ showing, total, page, pageCount }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-gray-500">
        Showing {showing} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-700">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function Products() {
  const [activeTab, setActiveTab] = useState("loans");
  const [search, setSearch] = useState("");

  const { stats, rows, showing, total, page, pageCount } =
    DATA_BY_TAB[activeTab];

  return (
    <Layout activeNavItem="Products">
      <div className="p-6 space-y-6 max-w-[1600px]">
        {/* Page header */}
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

        {/* Tabs */}
        <ProductTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Stat cards */}
        <div className="flex flex-wrap gap-6">
          <StatCard label="Avg Interest Rate" value={stats.avgInterestRate} />
          <StatCard
            label="Total Active Products"
            value={stats.totalActiveProducts}
          />
          <StatCard label="New Signups (FD)" value={stats.newSignups} />
        </div>

        {/* Filters */}
        <FilterBar searchValue={search} onSearchChange={setSearch} />

        {/* Table + footer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <ProductsTable rows={rows} />
          <TableFooter
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
