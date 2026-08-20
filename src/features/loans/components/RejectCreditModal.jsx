import { useState } from "react";

import Modal, { ModalFooter } from "./Modal";

export default function RejectCreditModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Reject Credit Check">
      <p className="text-sm text-gray-500">
        Are you sure you want to reject credit check for this user. This action
        cannot be undone - customer would have to create a new application.
      </p>
      <div className="mt-5">
        <label className="block text-sm text-gray-500 mb-2">
          Reason (Optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rejection"
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none"
        />
      </div>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors cursor-pointer"
        >
          Reject credit check
        </button>
      </ModalFooter>
    </Modal>
  );
}
