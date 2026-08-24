import { useEffect, useState } from "react";
import Modal from "@/shared/components/ModalShell";

export default function LiquidityDecisionModal({
  open,
  onClose,
  mode = "approve",
  loading = false,
  onConfirm,
}) {
  const isApprove = mode === "approve";
  const [note, setNote] = useState(isApprove ? "Verified and approved." : "");

  useEffect(() => {
    if (open) {
      setNote(isApprove ? "Verified and approved." : "");
    }
  }, [open, isApprove]);

  const handleConfirm = () => {
    onConfirm(note.trim());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isApprove ? "Approve Liquidity Request" : "Reject Liquidity Request"}
    >
      <p className="text-sm text-slate-500">
        {isApprove
          ? "Are you sure you want to approve this liquidity request? Confirm the admin note below."
          : "Are you sure you want to reject this liquidity request? This action cannot be undone. Please provide a reason below."}
      </p>

      <div className="mt-5">
        <label className="block text-sm text-slate-500 mb-2">
          {isApprove ? "Admin Note" : "Reason"}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            isApprove
              ? "Verified and approved."
              : "Enter reason for rejection"
          }
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isApprove
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading
            ? isApprove
              ? "Approving..."
              : "Rejecting..."
            : isApprove
              ? "Approve Request"
              : "Reject Request"}
        </button>
      </div>
    </Modal>
  );
}
