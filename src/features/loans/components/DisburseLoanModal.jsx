import Modal, { ModalFooter } from "./Modal";
import { formatNaira } from "@/features/loans/helpers/loanHelpers";

export default function DisburseLoanModal({
  open,
  onClose,
  onConfirm,
  amount,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Disburse Loan">
      <p className="text-sm text-gray-500">
        Are you sure you want to disburse this loan? Approved amount will be
        disbursed to customer's wallet
      </p>
      <div className="mt-5">
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-400 bg-gray-50">
          {formatNaira(amount)}
        </div>
      </div>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
        >
          Disburse loan
        </button>
      </ModalFooter>
    </Modal>
  );
}
