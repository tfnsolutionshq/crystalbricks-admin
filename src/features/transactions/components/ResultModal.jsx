import Modal from "./ModalShell.jsx";

// ============================================================================
// RESULT MODAL
// Shown after a Confirm Approval / Confirm Rejection action completes.
// variant="success"  -> green check, "Transaction Successful"
// variant="rejected" -> red cross,  "Transaction rejected"
// ============================================================================
export default function ResultModal({ variant, onDone }) {
  const isSuccess = variant === "success";

  return (
    <Modal onClose={onDone} className="text-center">
      <div
        className={`w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center ${
          isSuccess ? "bg-green-50" : "bg-red-50"
        }`}
      >
        {isSuccess ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-7 h-7 text-green-600"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="8.5 12.5 11 15 15.5 9.5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-7 h-7 text-red-500"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-1.5">
        {isSuccess ? "Transaction Successful" : "Transaction rejected"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {isSuccess
          ? "Transaction have been approved"
          : "Transaction have been rejected"}
      </p>

      <button
        onClick={onDone}
        className="w-full py-2.5 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700"
      >
        Done
      </button>
    </Modal>
  );
}
