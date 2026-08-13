// src/features/contributions/pages/ContributionDetailsPage.jsx
// Standalone details page for a single contribution/investment.
// No customer info, no tabs — just the stat cards, progress, plan
// details, financial breakdown, and payout schedule.
// Route: /contributions/investments/:investmentId

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";

import { fetchInvestmentDetail } from "@/features/contributions/api/contributionsApi";

import {
  getStatusVariant,
  formatContributionDate,
  getPayoutFrequencyLabel,
} from "@/features/contributions/helpers/contributionsHelpers";

const USE_MOCK = false; // flip to false once the endpoint is wired up

export default function ContributionDetailsPage() {
  const { investmentId } = useParams();
  const navigate = useNavigate();

  const [investment, setInvestment] = useState(null);
  const [plan, setPlan] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [progress, setProgress] = useState(null);
  const [maturity, setMaturity] = useState(null);
  const [payout_schedule, setPayoutSchedule] = useState([]);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyReference = async () => {
    const value = investment?.reference ?? "";
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadContributionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await fetchInvestmentDetail(investmentId);
      setInvestment(data.investment);
      setPlan(data.plan);
      setFinancials(data.financials);
      setProgress(data.progress);
      setMaturity(data.maturity);
      setPayoutSchedule(data.payout_schedule ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, [investmentId]);

  useEffect(() => {
    loadContributionDetails();
  }, [loadContributionDetails]);

  if (!loading && error) {
    return (
      <Layout activeNavItem="Loans">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={loadContributionDetails}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!loading && !investment) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          <button
            type="button"
            onClick={() => navigate("/contributions")}
            className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer mb-6"
            aria-label="Back to contributions"
          >
            <ArrowLeft size={16} />
          </button>
          <p className="text-slate-500">{error ?? "Contribution not found."}</p>
        </div>
      </Layout>
    );
  }

  const skeletonContent = (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen animate-pulse">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-200 rounded" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200 mb-2" />
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j}>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                  <div className="h-4 w-32 bg-gray-200 rounded mt-1" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>
        <div className="px-5 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0"
            >
              <div className="h-3 w-8 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeNavItem="Contributions">
      {loading ? (
        skeletonContent
      ) : (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* Header */}
          <button
            type="button"
            onClick={() => navigate("/contributions")}
            className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer mb-6"
            aria-label="Back to contributions"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-lg font-bold text-slate-900">
              {investment.name}
            </h1>
            <Badge variant={getStatusVariant(investment.status)}>
              {getStatusVariant(investment.status)}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mb-6">{investment.reference}</p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Principal Amount</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(financials.principal_amount, { decimals: 2 })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Expected RORC</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(financials.total_expected_roi, { decimals: 2 })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Maturity Value</p>
              <p className="text-xl font-bold text-pink-600">
                {formatCurrency(financials.maturity_value, { decimals: 2 })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Days Remaining</p>
              <p className="text-xl font-bold text-slate-900">
                {progress.days_remaining} days
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">
                Investment Progress ({progress.payouts_made}/
                {progress.total_payouts} payouts made)
              </p>
              <span className="text-sm font-semibold text-pink-600">
                {progress.percentage_completion}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
              <div
                className="h-full bg-pink-600 rounded-full"
                style={{ width: `${progress.percentage_completion}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{formatContributionDate(investment.start_date)}</span>
              <span>{formatContributionDate(investment.maturity_date)}</span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Investment Details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Investment Details
              </h2>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Reference</p>
                  <p className="font-medium text-slate-800 flex items-center gap-1.5">
                    {investment.reference}
                    <button
                      type="button"
                      onClick={handleCopyReference}
                      className="text-slate-300 hover:text-slate-500 cursor-pointer"
                      aria-label="Copy reference"
                      title={copied ? "Copied" : "Copy reference"}
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Investment Plan</p>
                  <p className="font-medium text-slate-800">{plan.name}</p>
                </div>

                <div>
                  <p className="text-slate-400 mb-1">Principal Amount</p>
                  <p className="font-medium text-slate-800">
                    {formatCurrency(financials.principal_amount, {
                      decimals: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">RORC Rate</p>
                  <p className="font-medium text-slate-800">
                    {financials.roi_percentage}% (
                    {formatCurrency(financials.roi_per_payout, { decimals: 2 })}{" "}
                    / payout)
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-1">Payout Frequency</p>
                  <p className="font-medium text-slate-800">
                    {getPayoutFrequencyLabel(plan.payout_frequency)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Duration</p>
                  <p className="font-medium text-slate-800">
                    {plan.duration_in_months} months
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-1">Start Date</p>
                  <p className="font-medium text-slate-800">
                    {formatContributionDate(investment.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Maturity Date</p>
                  <p className="font-medium text-slate-800">
                    {formatContributionDate(investment.maturity_date)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-1">Date Created</p>
                  <p className="font-medium text-slate-800">
                    {formatDateTime(investment.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Admin Note</p>
                  <p className="font-medium text-slate-800">
                    {investment.admin_note || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Financial Breakdown
              </h2>
              <div className="divide-y divide-slate-50">
                <div className="flex items-center justify-between py-3">
                  <p className="text-slate-500 text-sm">Principal Investment</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(financials.principal_amount, {
                      decimals: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-slate-500 text-sm">RORC Paid So Far</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(financials.roi_paid_so_far, {
                      decimals: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-slate-500 text-sm">
                    RORC Remaining ({financials.roi_percentage}%)
                  </p>
                  <p className="font-semibold text-emerald-600">
                    +{" "}
                    {formatCurrency(financials.roi_remaining, { decimals: 2 })}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3 bg-pink-50/60 -mx-5 px-5 rounded-b-xl">
                  <p className="font-semibold text-slate-900 text-sm">
                    Total at Maturity
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatCurrency(financials.maturity_value, { decimals: 2 })}
                  </p>
                </div>
              </div>

              {maturity.maturity_status && (
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Maturity Status</span>
                  <Badge variant={getStatusVariant(maturity.maturity_status)}>
                    {getStatusVariant(maturity.maturity_status)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Payout schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Payout Schedule
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400">
                    <th className="px-5 py-3.5 font-medium">#</th>
                    <th className="px-5 py-3.5 font-medium">Payout Date</th>
                    <th className="px-5 py-3.5 font-medium">RORC Amount</th>
                    <th className="px-5 py-3.5 font-medium">Principal</th>
                    <th className="px-5 py-3.5 font-medium">Total</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payout_schedule.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-5 py-3.5 text-slate-700">
                        {payout.payout_number}
                        {payout.is_maturity && (
                          <span className="ml-2 text-xs text-pink-600 font-medium">
                            Maturity
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {formatContributionDate(payout.payout_date)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {formatCurrency(payout.roi_amount, { decimals: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                        {payout.principal_component > 0
                          ? formatCurrency(payout.principal_component, {
                              decimals: 2,
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {formatCurrency(payout.total_amount, { decimals: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={getStatusVariant(payout.status)}>
                          {getStatusVariant(payout.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {payout_schedule.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No payouts scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
