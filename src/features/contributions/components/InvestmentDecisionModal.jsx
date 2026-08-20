// src/features/contributions/components/InvestmentDecisionModal.jsx
// Modal used to approve or reject a pending investment/contribution.
// The admin enters a reason that is sent as the admin_note.

import { useState } from "react";

import Modal from "@/shared/components/ModalShell";

export default function InvestmentDecisionModal({
  open,
  onClose,
  mode = "approve",
  loading = false,
  onConfirm,
}) {
  const [note, setNote] = useState("");

  const isApprove = mode === "approve";

  const handleConfirm = () => {
    onConfirm(note);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isApprove ? "Approve Investment" : "Reject Investment"}
    >
      <p className="text-sm text-slate-500">
        {isApprove
          ? "Are you sure you want to approve this investment? Provide a reason below."
          : "Are you sure you want to reject this investment? Provide a reason below."}
      </p>

      <div className="mt-5">
        <label className="block text-sm text-slate-500 mb-2">Reason</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter reason"
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
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading
            ? isApprove
              ? "Approving..."
              : "Rejecting..."
            : isApprove
              ? "Approve investment"
              : "Reject investment"}
        </button>
      </div>
    </Modal>
  );
}