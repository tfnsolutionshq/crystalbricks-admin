import { useState } from "react";
import Modal, { ModalFooter } from "./Modal";

export default function DisburseLoanModal({
  open,
  onClose,
  onConfirm,
  defaultAmount,
  loading = false,
}) {
  const initialAmount = Number(defaultAmount)
    ? Number(defaultAmount).toLocaleString("en-US")
    : "";
  const [amount, setAmount] = useState(initialAmount);

  const handleAmountChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, "");
    setAmount(digits ? Number(digits).toLocaleString("en-US") : "");
  };

  const handleConfirm = () => {
    onConfirm(amount.replace(/,/g, ""));
  };

  return (
    <Modal open={open} onClose={onClose} title="Disburse Loan">
      <p className="text-sm text-gray-500">
        Enter the amount to disburse to the customer's wallet.
      </p>
      <div className="mt-5">
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            ₦
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleAmountChange}
            className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
          />
        </div>
      </div>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || !amount || Number(amount.replace(/,/g, "")) <= 0}
          className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Disbursing..." : "Disburse loan"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
