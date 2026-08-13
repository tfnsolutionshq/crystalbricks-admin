import { useState } from "react";
import Modal from "./ModalShell.jsx";
import { rejectionReasons } from "@/features/transactions/mocks/transactionMockData.js";

// ============================================================================
// CONFIRM REJECTION MODAL
// Shown after clicking "Reject" on an in-progress transaction. Requires a
// reason to be picked before "Yes" is enabled.
// ============================================================================
export default function ConfirmRejectionModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Confirm Rejection</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        Are you sure you want to reject this transaction?
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Select Reason
      </label>
      <div className="relative mb-6">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none"
        >
          <option value="" disabled>
            Select reason
          </option>
          {rejectionReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
        >
          No
        </button>
        <button
          onClick={() => onConfirm(reason)}
          disabled={!reason}
          className="py-2.5 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-50"
        >
          Yes
        </button>
      </div>
    </Modal>
  );
}
