// src/features/contributions/pages/CustomerContributionDetailsPage.jsx
// Subpage reached by clicking a customer from ContributionsPage. Shows the
// customer's profile summary and every investment/contribution plan they
// hold, each of which can open the shared InvestmentDetailsModal.

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Mail, Phone, CalendarDays } from "lucide-react";

import Layout from "@/shared/components/DashboardComponents/Layout";

import { Badge } from "@/features/customers/components/GeneralCustomerComponents";
import { formatCurrency } from "@/features/analytics/helpers/analyticsHelpers";

import ContributionDetailsModal from "@/features/contributions/components/ContributionDetailsModal";

import { contributions as allContributions } from "@/features/contributions/mocks/contributionsMockData";
import {
  getCustomerById,
  getInvestmentsForCustomer,
  getCategoryLabel,
  getFrequencyLabel,
  getStatusVariant,
  getStatusLabel,
  getKycVariant,
  formatContributionDate,
  getProgressPercent,
} from "@/features/contributions/helpers/contributionsHelpers";

export default function CustomerContributionDetailsPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const customer = getCustomerById(customerId);
  const customerInvestments = useMemo(
    () => getInvestmentsForCustomer(allContributions, customerId),
    [customerId],
  );

  const totalContributed = customerInvestments.reduce(
    (sum, inv) => sum + inv.totalContributed,
    0,
  );
  const activeCount = customerInvestments.filter(
    (inv) => inv.status === "active",
  ).length;

  if (!customer) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
        <button
          type="button"
          onClick={() => navigate("/contributions")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contributions
        </button>
        <p className="text-slate-500">Customer not found.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Back link                                                    */}
          {/* ------------------------------------------------------------- */}
          <button
            type="button"
            onClick={() => navigate("/contributions")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contributions
          </button>

          {/* ------------------------------------------------------------- */}
          {/* Customer profile card                                        */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-lg font-semibold shrink-0">
                  {customer.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-slate-900">
                      {customer.name}
                    </h1>
                    <Badge variant={getKycVariant(customer.kycStatus)}>
                      {customer.kycStatus.charAt(0).toUpperCase() +
                        customer.kycStatus.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {customer.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Joined {formatContributionDate(customer.joinDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Summary stats                                                */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Total Contributed</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalContributed, { decimals: 0 })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Total Plans</p>
              <p className="text-2xl font-bold text-slate-900">
                {customerInvestments.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Active Plans</p>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Investment plans table                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Contribution Plans
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400">
                    <th className="px-5 py-3.5 font-medium">Plan</th>
                    <th className="px-5 py-3.5 font-medium">Amount</th>
                    <th className="px-5 py-3.5 font-medium">Frequency</th>
                    <th className="px-5 py-3.5 font-medium">Progress</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {customerInvestments.map((investment) => {
                    const progress = getProgressPercent(
                      investment.totalContributed,
                      investment.targetAmount,
                    );
                    return (
                      <tr
                        key={investment.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800">
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
                        <td className="px-5 py-3.5 min-w-35">
                          {progress === null ? (
                            <span className="text-slate-400">—</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-pink-600 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                {progress}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={getStatusVariant(investment.status)}>
                            {getStatusLabel(investment.status)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvestment(investment)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            aria-label="View investment details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {customerInvestments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        This customer has no contribution plans yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Modal                                                        */}
          {/* ------------------------------------------------------------- */}
          <ContributionDetailsModal
            open={!!selectedInvestment}
            investment={selectedInvestment}
            customer={customer}
            onClose={() => setSelectedInvestment(null)}
          />
        </div>
      </div>
    </Layout>
  );
}
