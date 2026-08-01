import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import Card from "@/shared/components/Card";

import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import {
  fetchLoanDetail,
  disburseLoan,
  rejectLoan,
} from "@/features/loans/api/loansApi";

import {
  getAvailableTabs,
  getHeaderActions,
  getStatusVariant,
} from "@/features/loans/helpers/loanHelpers";

import ApplicationDetailsTab from "@/features/loans/components/ApplicationDetailsTab";
import KYCTab from "@/features/loans/components/KYCTab";
import CreditCheckTab from "@/features/loans/components/CreditCheckTab";
import ApprovalDetailsTab from "@/features/loans/components/ApprovalDetailsTab";
import RepaymentScheduleTab from "@/features/loans/components/RepaymentScheduleTab";
import NotesTab from "@/features/loans/components/NotesTab";

import ApproveLoanModal from "@/features/loans/components/ApproveLoanModal";
import RejectLoanModal from "@/features/loans/components/RejectLoanModal";
import DisburseLoanModal from "@/features/loans/components/DisburseLoanModal";
import SuccessModal from "@/features/loans/components/SuccessModal";

export default function LoanDetail() {
  const { reference, tab } = useParams();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerModal, setHeaderModal] = useState(null);
  const [disbursing, setDisbursing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [successContent, setSuccessContent] = useState(null);

  const loadLoan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchLoanDetail(reference);
      setLoan(data);
      setDetail(data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    loadLoan();
  }, [loadLoan]);

  const SKELETON_TABS = [
    { key: "application", label: "Application Details" },
    { key: "kyc", label: "KYC" },
    { key: "credit", label: "Credit Check" },
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors"
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

  const goToTab = (key) => navigate(`/loans/${reference}/${key}`);

  const updateDetail = (patch) => setDetail((prev) => ({ ...prev, ...patch }));

  // ---- Credit handlers ----
  const handleApproveCredit = () =>
    updateDetail({ credit: { ...detail.credit, status: "approved" } });
  const handleRejectCredit = (reason) =>
    updateDetail({
      credit: {
        ...detail.credit,
        status: "rejected",
        reason: reason || "Rejected by reviewer.",
      },
    });

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
  const handleDisburse = async (amount) => {
    setDisbursing(true);
    try {
      await disburseLoan(detail.id, amount);
      setSuccessContent({
        label: "Loan Disbursement",
        title: "Loan Disbursed",
        subtitle: "The loan amount has been disbursed to the customer's wallet",
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

  // ---- Notes ----
  const handlePostComment = (message) => {
    updateDetail({
      notes: [
        {
          author: "You",
          role: "Admin",
          tag: "Comment",
          message,
          date: new Date().toISOString(),
        },
        ...detail.notes,
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
                      {loan.reference ?? "N/A"}
                    </h1>
                    <Badge variant={getStatusVariant(loan.status)}>
                      {formatStatus(loan.status)}
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
                {headerActions.includes("approve") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("approve")}
                    className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                )}
                {headerActions.includes("disburse") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("disburse")}
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Disburse
                  </button>
                )}
                {headerActions.includes("reject") && (
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
                <KYCTab kycDetails={detail.kyc_details} />
              )}
              {activeTab === "credit" && (
                <CreditCheckTab
                  credit={detail.credit}
                  onApprove={handleApproveCredit}
                  onReject={handleRejectCredit}
                />
              )}
              {activeTab === "approval" && (
                <ApprovalDetailsTab
                  approval={detail.approval}
                  canEdit={
                    loan.status === "Awaiting" || loan.status === "Pending"
                  }
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
              {activeTab === "notes" && (
                <NotesTab
                  note={detail.rejection_note}
                  onPostComment={handlePostComment}
                />
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
                onConfirm={() => {
                  setSuccessContent({
                    label: "Loan Application",
                    title: "Application Approved",
                    subtitle: "Continue with the application review process",
                  });
                  setHeaderModal("success");
                }}
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
              <SuccessModal
                open={headerModal === "success"}
                onClose={() => setHeaderModal(null)}
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
