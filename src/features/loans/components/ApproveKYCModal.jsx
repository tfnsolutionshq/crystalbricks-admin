import Modal, { ModalFooter } from "./Modal";

export default function ApproveKYCModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Approve KYC Documents">
      <p className="text-sm text-gray-500">
        Are you sure you want to approve all KYC documents from this user. This
        action cannot be undone.
      </p>
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
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium transition-colors cursor-pointer"
        >
          Approve KYC
        </button>
      </ModalFooter>
    </Modal>
  );
}
