import Modal from "./ModalShell.jsx";

// ============================================================================
// CONFIRM APPROVAL MODAL
// Shown after clicking "Approve" on an in-progress transaction.
// ============================================================================
export default function ConfirmApprovalModal({ onClose, onConfirm }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Confirm Approval</h2>
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

      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to approve this transaction?
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="py-2.5 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700"
        >
          Yes
        </button>
      </div>
    </Modal>
  );
}
