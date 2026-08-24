import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, ExternalLink, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import Card from "@/shared/components/Card";
import Field from "@/shared/components/Field";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";

import {
  fetchLiquidityRequestDetail,
  approveLiquidityRequest,
  rejectLiquidityRequest,
} from "@/features/contributions/api/contributionsApi";
import {
  formatContributionDate,
  getStatusLabel,
} from "@/features/contributions/helpers/contributionsHelpers";
import LiquidityDecisionModal from "@/features/contributions/components/LiquidityDecisionModal";

function toTitleCase(value) {
  if (!value) return value;
  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function LiquidityRequestDetailsPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Modal & Action states
  const [decisionModal, setDecisionModal] = useState(null); // "approve" | "reject" | null
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLiquidityRequestDetail(requestId);
      const data = res?.data?.data ? res.data.data : res?.data ?? res;
      setRequest(data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleCopyReference = async () => {
    const value = request?.reference ?? "";
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

  const handleDecision = async (note) => {
    setDecisionLoading(true);
    setActionError(null);
    try {
      if (decisionModal === "approve") {
        await approveLiquidityRequest(requestId, note);
      } else {
        await rejectLiquidityRequest(requestId, note);
      }
      setDecisionModal(null);
      await loadDetail();
    } catch (err) {
      setActionError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setDecisionLoading(false);
    }
  };

  if (!loading && error) {
    return (
      <Layout activeNavItem="Contributions">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={loadDetail}
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

  if (!loading && !request) {
    return (
      <Layout activeNavItem="Contributions">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">Liquidity request not found.</p>
            <button
              type="button"
              onClick={() => navigate("/contributions")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Contributions
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const isUnderReview = String(request?.status).toUpperCase() === "UNDER_REVIEW";

  return (
    <Layout activeNavItem="Contributions">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {loading ? (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gray-200" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-4 w-36 bg-gray-200 rounded" />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/contributions")}
                  className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Back to contributions"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-gray-900">
                      {request?.reference || "Liquidity Request"}
                    </h1>
                    <button
                      type="button"
                      onClick={handleCopyReference}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 transition-colors"
                      title="Copy Reference"
                    >
                      {copied ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <Badge>{getStatusLabel(request.status)}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Requested on {formatDateTime(request.created_at)}
                  </p>
                </div>
              </div>
            )}

            {!loading && isUnderReview && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setDecisionModal("approve");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setDecisionModal("reject");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}
          </div>

          {actionError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {actionError}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Details Content (No Tabs)                                    */}
          {/* ------------------------------------------------------------- */}
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <Card>
                <div className="h-5 w-44 bg-gray-200 rounded mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                      <div className="h-4 w-36 bg-gray-200 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div className="h-5 w-44 bg-gray-200 rounded mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                      <div className="h-4 w-36 bg-gray-200 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Request Information */}
              <Card title="Request Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  <Field label="Liquidity Reference">
                    {request.reference || "—"}
                  </Field>
                  <Field label="Status">
                    <Badge>{getStatusLabel(request.status)}</Badge>
                  </Field>
                  <Field label="Date Requested">
                    {formatDateTime(request.created_at)}
                  </Field>
                  <Field label="Passcode Confirmed At">
                    {formatDateTime(request.passcode_confirmed_at)}
                  </Field>
                  <Field label="Approved At">
                    {formatDateTime(request.approved_at)}
                  </Field>
                  <Field label="Completed At">
                    {formatDateTime(request.completed_at)}
                  </Field>
                  <Field label="Reason">
                    {request.reason || "—"}
                  </Field>
                  <Field label="Admin Note">
                    {request.admin_note || "—"}
                  </Field>
                </div>
              </Card>

              {/* Associated Investment */}
              <Card title="Associated Investment">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  <Field label="Investment Reference">
                    {request.investment?.id ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/contributions/${request.investment.id}`)
                        }
                        className="inline-flex items-center gap-1.5 text-pink-700 hover:text-pink-800 font-medium cursor-pointer"
                      >
                        {request.investment.reference || "View Contribution"}
                        <ExternalLink size={14} />
                      </button>
                    ) : (
                      request.investment?.reference || "—"
                    )}
                  </Field>
                  <Field label="Investment Name">
                    {request.investment?.name || "—"}
                  </Field>
                  <Field label="Maturity Date">
                    {request.investment?.maturity_date
                      ? formatContributionDate(request.investment.maturity_date)
                      : "—"}
                  </Field>
                </div>
              </Card>

              {/* Financial Breakdown */}
              <Card title="Financial Breakdown">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  <Field label="Principal Amount">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(request.principal_amount)}
                    </span>
                  </Field>
                  <Field label="Penalty Type">
                    {toTitleCase(request.penalty_type) || "—"}
                  </Field>
                  <Field label="Penalty Value">
                    {request.penalty_value != null
                      ? String(request.penalty_type).toUpperCase() ===
                        "PERCENTAGE"
                        ? `${request.penalty_value}%`
                        : formatCurrency(request.penalty_value)
                      : "—"}
                  </Field>
                  <Field label="Penalty Amount">
                    {request.penalty_amount != null
                      ? formatCurrency(request.penalty_amount)
                      : "—"}
                  </Field>
                  <Field label="Accrued Interest Forfeited">
                    {request.accrued_interest_forfeited != null
                      ? formatCurrency(request.accrued_interest_forfeited)
                      : "—"}
                  </Field>
                  <Field label="Net Payout Amount">
                    <span className="font-semibold text-gray-900">
                      {request.net_payout_amount != null
                        ? formatCurrency(request.net_payout_amount)
                        : "—"}
                    </span>
                  </Field>
                </div>
              </Card>

              {/* Payout & Processing Details */}
              <Card title="Payout & Processing Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  <Field label="Notice Period Ends On">
                    {formatDateTime(request.notice_period_ends_on)}
                  </Field>
                  <Field label="Payout Due After">
                    {formatDateTime(request.payout_due_after)}
                  </Field>
                  <Field label="Payout Attempts">
                    {request.payout_attempts ?? 0}
                  </Field>
                  <Field label="Failure Reason">
                    {request.failure_reason || "—"}
                  </Field>
                </div>
              </Card>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Decision Modal                                               */}
          {/* ------------------------------------------------------------- */}
          <LiquidityDecisionModal
            open={Boolean(decisionModal)}
            mode={decisionModal || "approve"}
            loading={decisionLoading}
            onClose={() => {
              if (!decisionLoading) setDecisionModal(null);
            }}
            onConfirm={handleDecision}
          />
        </div>
      </div>
    </Layout>
  );
}
