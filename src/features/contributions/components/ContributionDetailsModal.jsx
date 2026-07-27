// src/features/contributions/components/InvestmentDetailsModal.jsx
// "View Investment Details" modal — read-only summary of a single
// investment/contribution plan plus its recent transaction history.
// Triggered from both ContributionsPage and CustomerContributionDetailsPage.

import Modal from "@/features/team-management/components/ModalShell";
import { Badge } from "@/features/customers/components/GeneralCustomerComponents";
import { formatCurrency } from "@/features/analytics/helpers/analyticsHelpers";
import {
  getCategoryLabel,
  getFrequencyLabel,
  getStatusVariant,
  getStatusLabel,
  getTransactionVariant,
  formatContributionDate,
  getProgressPercent,
} from "@/features/contributions/helpers/contributionsHelpers";

export default function ContributionDetailsModal({
  open,
  investment,
  customer,
  onClose,
}) {
  if (!investment) return null;

  const progress = getProgressPercent(
    investment.totalContributed,
    investment.targetAmount,
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Investment Details"
      maxWidth="max-w-lg"
    >
      {/* Plan header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {investment.planName}
          </p>
          {customer && (
            <p className="text-xs text-slate-400 mt-0.5">
              {customer.name} · {customer.email}
            </p>
          )}
        </div>
        <Badge variant={getStatusVariant(investment.status)}>
          {getStatusLabel(investment.status)}
        </Badge>
      </div>

      {/* Progress (only for plans with a target) */}
      {investment.targetAmount && (
        <div className="bg-slate-50 rounded-xl px-4 py-3.5 mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500">
              {formatCurrency(investment.totalContributed, { decimals: 0 })} of{" "}
              {formatCurrency(investment.targetAmount, { decimals: 0 })}
            </span>
            <span className="font-semibold text-slate-800">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-pink-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Key facts grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-5">
        <div>
          <p className="text-xs text-slate-400 mb-1">Plan Type</p>
          <p className="text-sm font-medium text-slate-800">
            {getCategoryLabel(investment.category)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Contribution Amount</p>
          <p className="text-sm font-medium text-slate-800">
            {formatCurrency(investment.amountPerContribution, { decimals: 0 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Frequency</p>
          <p className="text-sm font-medium text-slate-800">
            {getFrequencyLabel(investment.frequency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Interest Rate</p>
          <p className="text-sm font-medium text-slate-800">
            {investment.interestRate}% p.a.
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Start Date</p>
          <p className="text-sm font-medium text-slate-800">
            {formatContributionDate(investment.startDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Maturity Date</p>
          <p className="text-sm font-medium text-slate-800">
            {formatContributionDate(investment.maturityDate)}
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <p className="text-sm font-semibold text-slate-900 mb-2.5">
          Recent Contributions
        </p>
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          {investment.transactions.length === 0 && (
            <p className="text-sm text-slate-400 px-4 py-4 text-center">
              No contributions recorded yet.
            </p>
          )}
          {investment.transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                index !== investment.transactions.length - 1
                  ? "border-b border-slate-50"
                  : ""
              }`}
            >
              <span className="text-slate-500">
                {formatContributionDate(tx.date)}
              </span>
              <span className="font-medium text-slate-800">
                {formatCurrency(tx.amount, { decimals: 0 })}
              </span>
              <Badge variant={getTransactionVariant(tx.status)}>
                {tx.status === "success" ? "Success" : "Failed"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
