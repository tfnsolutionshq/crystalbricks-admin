import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";

import { getLoanByReference } from "@/features/loans/mocks/loansMockData";
import { getLoanDetail } from "@/features/loans/mocks/loanDetailsMockData";

import {
  getAvailableTabs,
  getHeaderActions,
  getStatusVariant,
  buildFallbackDetail,
  formatDateTime,
} from "@/features/loans/helpers/loanHelpers";

import ApplicationDetailsTab from "@/features/loans/components/ApplicationDetailsTab";
import KYCDocumentsTab from "@/features/loans/components/KYCDocumentsTab";
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

  const loan = useMemo(() => getLoanByReference(reference), [reference]);
  const [detail, setDetail] = useState(() => {
    if (!loan) return null;
    return getLoanDetail(reference) || buildFallbackDetail(loan);
  });
  const [headerModal, setHeaderModal] = useState(null); // 'approve' | 'reject' | 'disburse' | 'success'

  if (!loan || !detail) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loan not found.</p>
      </div>
    );
  }

  const availableTabs = getAvailableTabs(loan);
  const activeTab = availableTabs.some((t) => t.key === tab)
    ? tab
    : availableTabs[0].key;
  const headerActions = getHeaderActions(loan);

  const goToTab = (key) => navigate(`/loans/${reference}/${key}`);

  const updateDetail = (patch) => setDetail((prev) => ({ ...prev, ...patch }));

  // ---- KYC handlers ----
  const handleApproveKYC = () =>
    updateDetail({
      kyc: {
        ...detail.kyc,
        status: "approved",
        reviewedDate: new Date().toISOString(),
      },
    });
  const handleRejectKYC = (reason) =>
    updateDetail({
      kyc: {
        ...detail.kyc,
        status: "rejected",
        reason: reason || "Rejected by reviewer.",
      },
    });
  const handleRequestDocument = () =>
    updateDetail({ kyc: { ...detail.kyc, status: "on_hold" } });

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

  return (
    <Layout activeNavItem="Loans">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => navigate("/loans")}
                className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                aria-label="Back to loans"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-gray-900">
                    {loan.reference}
                  </h1>
                  <Badge variant={getStatusVariant(loan.status)}>
                    {loan.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatDateTime(loan.date)}
                </p>
              </div>
            </div>

            {headerActions.length > 0 && (
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
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  >
                    Disburse
                  </button>
                )}
                {headerActions.includes("reject") && (
                  <button
                    type="button"
                    onClick={() => setHeaderModal("reject")}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
            {availableTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => goToTab(t.key)}
                className={`pb-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
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
          {activeTab === "application" && (
            <ApplicationDetailsTab application={detail.application} />
          )}
          {activeTab === "kyc" && (
            <KYCDocumentsTab
              kyc={detail.kyc}
              onApprove={handleApproveKYC}
              onReject={handleRejectKYC}
              onRequestDocument={handleRequestDocument}
            />
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
              canEdit={loan.status === "Awaiting" || loan.status === "Pending"}
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
            <NotesTab notes={detail.notes} onPostComment={handlePostComment} />
          )}

          {/* Header-level modals */}
          <ApproveLoanModal
            open={headerModal === "approve"}
            onClose={() => setHeaderModal(null)}
            defaultAmount={loan.amount}
            onConfirm={() => setHeaderModal("success")}
          />
          <RejectLoanModal
            open={headerModal === "reject"}
            onClose={() => setHeaderModal(null)}
            onConfirm={() => setHeaderModal(null)}
          />
          <DisburseLoanModal
            open={headerModal === "disburse"}
            onClose={() => setHeaderModal(null)}
            amount={detail.approval?.amount}
            onConfirm={() => setHeaderModal("success")}
          />
          <SuccessModal
            open={headerModal === "success"}
            onClose={() => setHeaderModal(null)}
            label="Loan Application"
            title="Application Approved"
            subtitle="Continue with the application review process"
          />
        </div>
      </div>
    </Layout>
  );
}
