import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import { getReviewVariant } from "@/features/loans/helpers/loanHelpers";

import ApproveKYCModal from "@/features/loans/components/ApproveKYCModal";
import RejectKYCModal from "@/features/loans/components/RejectKYCModal";
import RequestDocumentModal from "@/features/loans/components/RequestDocumentModal";
import ViewDocumentModal from "@/features/loans/components/ViewDocumentModal";
import SuccessModal from "./SuccessModal";

const STATUS_LABEL = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  on_hold: "On hold",
};

export default function KYCDocumentsTab({
  kyc,
  onApprove,
  onReject,
  onRequestDocument,
}) {
  const [modal, setModal] = useState(null); // 'approve' | 'reject' | 'request' | 'success' | null
  const [viewingDoc, setViewingDoc] = useState(null);

  if (!kyc) return null;
  const isPending = kyc.status === "pending" || kyc.status === "on_hold";

  return (
    <Card>
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">KYC Documents</h3>
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
              onClick={() => setModal("request")}
              className="text-gray-500 hover:text-gray-700"
            >
              Request
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
          <Badge variant={getReviewVariant(kyc.status)}>
            {STATUS_LABEL[kyc.status]}
          </Badge>
        )}
      </div>

      {kyc.status === "on_hold" && kyc.note && (
        <p className="text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-2.5 mb-5">
          {kyc.note}
        </p>
      )}
      {kyc.status === "rejected" && kyc.reason && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mb-5">
          {kyc.reason}
        </p>
      )}

      <div className="divide-y divide-gray-100">
        {kyc.documents.map((doc) => (
          <div key={doc.section} className="py-4 first:pt-0">
            <p className="text-sm font-semibold text-gray-900">{doc.section}</p>
            <p className="text-sm text-gray-500 mt-2">{doc.label}</p>
            <button
              type="button"
              onClick={() => setViewingDoc(doc)}
              className="text-sm font-medium text-gray-900 underline underline-offset-2 mt-0.5"
            >
              {doc.filename}
            </button>
          </div>
        ))}
      </div>

      <ApproveKYCModal
        open={modal === "approve"}
        onClose={() => setModal(null)}
        onConfirm={() => {
          onApprove?.();
          setModal("success");
        }}
      />
      <RejectKYCModal
        open={modal === "reject"}
        onClose={() => setModal(null)}
        onConfirm={(reason) => {
          onReject?.(reason);
          setModal(null);
        }}
      />
      <RequestDocumentModal
        open={modal === "request"}
        onClose={() => setModal(null)}
        onConfirm={(payload) => {
          onRequestDocument?.(payload);
          setModal(null);
        }}
      />
      <SuccessModal
        open={modal === "success"}
        onClose={() => setModal(null)}
        label="KYC"
        title="KYC Document Approved"
        subtitle="Continue with the application review"
      />
      <ViewDocumentModal
        open={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
        title="Identity Document"
        filename={viewingDoc?.filename}
      />
    </Card>
  );
}
