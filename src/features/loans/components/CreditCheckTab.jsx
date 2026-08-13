import { useState } from "react";

import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import {
  getReviewVariant,
  getRatingVariant,
  getRiskVariant,
} from "@/features/loans/helpers/loanHelpers";

import ApproveCreditModal from "@/features/loans/components/ApproveCreditModal";
import RejectCreditModal from "@/features/loans/components/RejectCreditModal";
import SuccessModal from "@/features/loans/components/SuccessModal";

const STATUS_LABEL = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function CreditCheckTab({ credit, onApprove, onReject }) {
  const [modal, setModal] = useState(null);

  if (!credit) return null;
  const isPending = credit.status === "pending";

  return (
    <Card>
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Credit Check</h3>
        {isPending ? (
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => setModal("approve")}
              className="text-blue-600 hover:text-blue-700"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setModal("reject")}
              className="text-red-500 hover:text-red-600"
            >
              Reject
            </button>
          </div>
        ) : (
          <Badge variant={getReviewVariant(credit.status)}>
            {STATUS_LABEL[credit.status]}
          </Badge>
        )}
      </div>

      {credit.status === "rejected" && credit.reason && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mb-5">
          {credit.reason}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500">Credit Score</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {credit.score ? `${credit.score}/850` : "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Credit Rating</p>
          <div className="mt-1">
            {credit.rating ? (
              <Badge variant={getRatingVariant(credit.rating)}>
                {credit.rating}
              </Badge>
            ) : (
              "-"
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Risk</p>
          <div className="mt-1">
            {credit.risk ? (
              <Badge variant={getRiskVariant(credit.risk)}>{credit.risk}</Badge>
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>

      <ApproveCreditModal
        open={modal === "approve"}
        onClose={() => setModal(null)}
        onConfirm={() => {
          onApprove?.();
          setModal("success");
        }}
      />
      <RejectCreditModal
        open={modal === "reject"}
        onClose={() => setModal(null)}
        onConfirm={(reason) => {
          onReject?.(reason);
          setModal(null);
        }}
      />
      <SuccessModal
        open={modal === "success"}
        onClose={() => setModal(null)}
        label="Credit Check"
        title="Credit Check Approved"
        subtitle="Continue with the application review"
      />
    </Card>
  );
}
