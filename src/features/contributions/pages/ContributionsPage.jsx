// src/features/contributions/pages/ContributionsPage.jsx
// Main/list page for Contributions. Header, stat cards, filter bar, and
// table are built inline; the customer row navigates to its detail
// subpage, and the kebab's "View Details" opens the shared
// InvestmentDetailsModal.

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, UserRound } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import SearchInput from "@/shared/components/SearchInput";
import FilterPill from "@/shared/components/FilterPill";
import KebabButton from "@/shared/components/KebabButton";
import Pagination from "@/shared/components/Pagination";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatNumber from "@/shared/utils/formtNumber";

import ContributionDetailsModal from "@/features/contributions/components/ContributionDetailsModal";

import {
  contributions,
  planCategories,
  statusOptions,
  contributionsStats,
  contributionsPagination,
} from "@/features/contributions/mocks/contributionsMockData";

import {
  getCustomerById,
  getCategoryLabel,
  getFrequencyLabel,
  getStatusVariant,
  getStatusLabel,
  formatContributionDate,
  filterInvestments,
} from "@/features/contributions/helpers/contributionsHelpers";

export default function ContributionsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(contributionsPagination.page);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const filtered = useMemo(
    () =>
      filterInvestments(contributions, {
        search,
        category: categoryFilter,
        status: statusFilter,
      }),
    [search, categoryFilter, statusFilter],
  );

  const categoryCycle = ["all", ...planCategories.map((c) => c.value)];
  const statusCycle = statusOptions.map((s) => s.value);

  return (
    <Layout activeNavItem="Contributions">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Contributions</h1>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors w-full sm:w-auto"
            >
              Export
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Stat cards                                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Total Contributions</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(contributionsStats.totalContributions, {
                  decimals: 0,
                })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Active Contributors</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(contributionsStats.activeContributors)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Active Plans</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(contributionsStats.activePlans)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Completed Plans</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(contributionsStats.completedPlans)}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Search + filter bar                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or plan"
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap items-center gap-3">
              <FilterPill
                label="Plan Type"
                value={
                  categoryFilter === "all"
                    ? "All"
                    : getCategoryLabel(categoryFilter)
                }
                onClick={() => {
                  const next =
                    categoryCycle[
                      (categoryCycle.indexOf(categoryFilter) + 1) %
                        categoryCycle.length
                    ];
                  setCategoryFilter(next);
                }}
              />
              <FilterPill
                label="Status"
                value={
                  statusOptions.find((s) => s.value === statusFilter)?.label
                }
                onClick={() => {
                  const next =
                    statusCycle[
                      (statusCycle.indexOf(statusFilter) + 1) %
                        statusCycle.length
                    ];
                  setStatusFilter(next);
                }}
              />
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Contributions table                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400">
                    <th className="px-5 py-3.5 font-medium">Customer</th>
                    <th className="px-5 py-3.5 font-medium">Plan</th>
                    <th className="px-5 py-3.5 font-medium">Amount</th>
                    <th className="px-5 py-3.5 font-medium">Frequency</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">
                      Next Contribution
                    </th>
                    <th className="px-5 py-3.5 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((investment) => {
                    const customer = getCustomerById(investment.customerId);
                    return (
                      <tr
                        key={investment.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/contributions/${customer.id}`)
                            }
                            className="flex items-center gap-3 min-w-0 text-left group"
                          >
                            <span className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-semibold shrink-0">
                              {customer.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 truncate group-hover:text-pink-600 transition-colors">
                                {customer.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {customer.email}
                              </p>
                            </div>
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-slate-700">
                            {investment.planName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {getCategoryLabel(investment.category)}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                          {formatCurrency(investment.amountPerContribution, {
                            decimals: 0,
                          })}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {getFrequencyLabel(investment.frequency)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={getStatusVariant(investment.status)}>
                            {getStatusLabel(investment.status)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                          {formatContributionDate(
                            investment.nextContributionDate,
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <KebabButton
                            items={[
                              {
                                label: "View Details",
                                icon: <Eye className="w-4 h-4" />,
                                onClick: () =>
                                  setSelectedInvestment(investment),
                              },
                              {
                                label: "View Customer",
                                icon: <UserRound className="w-4 h-4" />,
                                onClick: () =>
                                  navigate(`/contributions/${customer.id}`),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No contributions match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Footer pagination                                            */}
          {/* ------------------------------------------------------------- */}
          <Pagination
            showing={contributionsPagination.showing}
            total={contributionsPagination.total}
            page={page}
            pages={contributionsPagination.pages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPage((p) => Math.min(contributionsPagination.pages, p + 1))
            }
          />

          {/* ------------------------------------------------------------- */}
          {/* Modal                                                        */}
          {/* ------------------------------------------------------------- */}
          <ContributionDetailsModal
            open={!!selectedInvestment}
            investment={selectedInvestment}
            customer={
              selectedInvestment
                ? getCustomerById(selectedInvestment.customerId)
                : null
            }
            onClose={() => setSelectedInvestment(null)}
          />
        </div>
      </div>
    </Layout>
  );
}
