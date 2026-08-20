import Modal, { ModalFooter } from "./Modal";

export default function ApproveCreditModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Approve Credit Check">
      <p className="text-sm text-gray-500">
        Are you sure you want to approve credit check for this user. This action
        cannot be undone.
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
          Approve credit check
        </button>
      </ModalFooter>
    </Modal>
  );
}
