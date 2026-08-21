import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import Card from "@/shared/components/Card";

import formatDateTime from "@/shared/utils/formatDateTime";

import { useAuth } from "@/shared/context/AuthContext";

import {
  fetchLoanDetail,
  disburseLoan,
  rejectLoan,
  approveKYC,
  rejectKYC,
} from "@/features/loans/api/loansApi";

import {
  formatLoanStatus,
  getAvailableTabs,
  getHeaderActions,
  getStatusVariant,
} from "@/features/loans/helpers/loanHelpers";

import ApplicationDetailsTab from "@/features/loans/components/ApplicationDetailsTab";
import KYCTab from "@/features/loans/components/KYCTab";
import RepaymentScheduleTab from "@/features/loans/components/RepaymentScheduleTab";
import PayoutScheduleTab from "@/features/loans/components/PayoutScheduleTab";
import ApprovalDetailsTab from "@/features/loans/components/ApprovalDetailsTab";

import ApproveLoanModal from "@/features/loans/components/ApproveLoanModal";
import RejectLoanModal from "@/features/loans/components/RejectLoanModal";
import DisburseLoanModal from "@/features/loans/components/DisburseLoanModal";
import ApproveKYCModal from "@/features/loans/components/ApproveKYCModal";
import RejectKYCModal from "@/features/loans/components/RejectKYCModal";
import SuccessModal from "@/features/loans/components/SuccessModal";

export default function LoanDetail() {
  const { loanId, tab } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const [loan, setLoan] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerModal, setHeaderModal] = useState(null);
  const [kycModal, setKycModal] = useState(null);
  const [disbursing, setDisbursing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [approvingKyc, setApprovingKyc] = useState(false);
  const [rejectingKyc, setRejectingKyc] = useState(false);
  const [successContent, setSuccessContent] = useState(null);

  const loadLoan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchLoanDetail(loanId);
      setLoan(data);
      setDetail(data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    loadLoan();
  }, [loadLoan]);

  const SKELETON_TABS = [
    { key: "application", label: "Application Details" },
    { key: "kyc", label: "KYC" },
  ];

  if (!loading && error) {
    return (
      <Layout activeNavItem="Loans">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={loadLoan}
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

  if (!loading && !loan) {
    return (
      <Layout activeNavItem="Loans">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">Loan not found.</p>
            <button
              type="button"
              onClick={loadLoan}
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

  const availableTabs = loan ? getAvailableTabs(loan) : SKELETON_TABS;
  const activeTab = availableTabs.some((t) => t.key === tab)
    ? tab
    : availableTabs[0].key;
  const headerActions = loan ? getHeaderActions(loan) : [];

  const goToTab = (key) => navigate(`/loans/${loanId}/${key}`);

  const updateDetail = (patch) => setDetail((prev) => ({ ...prev, ...patch }));

  // ---- Reject handler ----
  const handleReject = async (reason) => {
    setRejecting(true);
    try {
      await rejectLoan(detail.id, reason);
      setSuccessContent({
        label: "Loan Application",
        title: "Application Rejected",
        subtitle: "The loan application has been rejected",
      });
      setHeaderModal("success");
      loadLoan();
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred.",
      );
    } finally {
      setRejecting(false);
    }
  };

  // ---- Disburse handler ----
  const handleDisburse = async ({ amount, period, interest, note }) => {
    setDisbursing(true);
    try {
      await disburseLoan(detail.id, {
        amount: amount ? Number(String(amount).replace(/,/g, "")) : null,
        interest_rate: interest ? Number(interest) : null,
        tenure_months: period ? parseInt(period, 10) : null,
        admin_note: note || null,
      });
      setSuccessContent({
        label: "Loan Disbursement",
        title: "Awaiting confirmation from the recipient",
        subtitle:
          "The customer has been informed of the counter request and will be funded once they accept it",
      });
      setHeaderModal("success");
      loadLoan();
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred.",
      );
    } finally {
      setDisbursing(false);
    }
  };

  // ---- KYC handlers ----
  const handleApproveKYC = async () => {
    setApprovingKyc(true);
    try {
      await approveKYC(detail.id);
      setSuccessContent({
        label: "KYC Documents",
        title: "KYC Documents Approved",
        subtitle: "The customer's KYC documents have been approved",
      });
      setKycModal("success");
      loadLoan();
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred.",
      );
    } finally {
      setApprovingKyc(false);
    }
  };

  const handleRejectKYC = async (note) => {
    setRejectingKyc(true);
    try {
      await rejectKYC(detail.id, note);
      setSuccessContent({
        label: "KYC Documents",
        title: "KYC Documents Rejected",
        subtitle: "The customer's KYC documents have been rejected",
      });
      setKycModal("success");
      loadLoan();
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred.",
      );
    } finally {
      setRejectingKyc(false);
    }
  };

  // ---- Schedule handlers ----
  const handleUpdateAmount = (row, payload) => {
    const delta =
      Number(payload.amount || 0) * (payload.action === "subtract" ? -1 : 1);
    updateDetail({
      schedule: detail.schedule.map((r) =>
        r === row ? { ...r, amountDue: r.amountDue + delta } : r,
      ),
    });
  };
  const handleAddEntry = (payload) => {
    updateDetail({
      schedule: [
        {
          transactionId: null,
          amountDue: Number(payload.amountDue || 0),
          paymentMethod: null,
          dueDate: payload.dueDate,
          paidDate: null,
          status: "Pending",
        },
        ...detail.schedule,
      ],
    });
  };

  const skeletonHeader = (
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
  );

  return (
    <Layout activeNavItem="Loans">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {loading ? (
              skeletonHeader
            ) : (
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/loans")}
                  className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Back to loans"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-gray-900">
                      {!loan?.user?.first_name || !loan?.user?.last_name
                        ? "N/A"
                        : `${loan?.user?.first_name} ${loan?.user?.last_name}`}
                    </h1>
                    <Badge variant={getStatusVariant(loan.status)}>
                      {formatLoanStatus(loan.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {formatDateTime(loan.created_at)}
                  </p>
                </div>
              </div>
            )}

            {!loading && headerActions.length > 0 && (
              <div className="flex items-center gap-3">
                {headerActions.includes("approve") && hasPermission("loans.approve") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("approve")}
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Disburse
                  </button>
                )}
                {headerActions.includes("disburse") && hasPermission("loans.disburse") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("disburse")}
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Disburse
                  </button>
                )}
                {headerActions.includes("reject") && hasPermission("loans.reject") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("reject")}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="pb-3 animate-pulse">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                ))
              : availableTabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => goToTab(t.key)}
                    className={`pb-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeTab === t.key
                        ? "border-gray-900 text-gray-900 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
          </div>

          {/* Tab content */}
          {loading ? (
            <div className="animate-pulse">
              <Card>
                <div className="h-5 w-44 bg-gray-200 rounded mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i}>
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                      <div className="h-4 w-36 bg-gray-200 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <>
              {activeTab === "application" && (
                <ApplicationDetailsTab loan={detail} />
              )}
              {activeTab === "kyc" && (
                <KYCTab
                  kycDetails={detail.kyc_details}
                  kycStatus={detail.kyc_status}
                  kycRejectionNote={detail.kyc_rejection_note}
                  kycReviewedAt={detail.kyc_reviewed_at}
                  kycResubmittedAt={detail.kyc_resubmitted_at}
                  onApprove={() => setKycModal("approve")}
                  onReject={() => setKycModal("reject")}
                  approving={approvingKyc}
                  rejecting={rejectingKyc}
                  canApprove={hasPermission("kyc.approve")}
                />
              )}
              {activeTab === "schedule" && (
                <RepaymentScheduleTab
                  schedule={detail.schedule}
                  allowEdits={loan.status === "Active"}
                  onUpdateAmount={handleUpdateAmount}
                  onAddEntry={handleAddEntry}
                />
              )}
              {activeTab === "payout" && <PayoutScheduleTab loan={detail} />}
              {activeTab === "approval" && (
                <ApprovalDetailsTab loan={detail} />
              )}
            </>
          )}

          {/* Header-level modals */}
          {!loading && (
            <>
              <ApproveLoanModal
                open={headerModal === "approve"}
                onClose={() => setHeaderModal(null)}
                defaultAmount={loan.amount}
                loading={disbursing}
                onConfirm={handleDisburse}
              />
              <RejectLoanModal
                open={headerModal === "reject"}
                onClose={() => setHeaderModal(null)}
                loading={rejecting}
                onConfirm={handleReject}
              />
              <DisburseLoanModal
                open={headerModal === "disburse"}
                onClose={() => setHeaderModal(null)}
                defaultAmount={detail?.amount}
                loading={disbursing}
                onConfirm={handleDisburse}
              />
              <ApproveKYCModal
                open={kycModal === "approve"}
                onClose={() => setKycModal(null)}
                onConfirm={handleApproveKYC}
              />
              <RejectKYCModal
                open={kycModal === "reject"}
                onClose={() => setKycModal(null)}
                loading={rejectingKyc}
                onConfirm={handleRejectKYC}
              />
              <SuccessModal
                open={headerModal === "success" || kycModal === "success"}
                onClose={() => {
                  setHeaderModal(null);
                  setKycModal(null);
                }}
                label={successContent?.label ?? "Loan Application"}
                title={successContent?.title ?? "Action Completed"}
                subtitle={successContent?.subtitle}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
