import { useState } from "react";
import Modal, { ModalFooter } from "./Modal";

const PERIOD_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return `${n} ${n === 1 ? "month" : "months"}`;
});

export default function ApproveLoanModal({
  open,
  onClose,
  onConfirm,
  defaultAmount,
  defaultPeriod = "3 months",
  defaultInterest = 13,
  loading = false,
}) {
  const [amount, setAmount] = useState(defaultAmount ?? "");
  const [period, setPeriod] = useState(defaultPeriod);
  const [interest, setInterest] = useState(defaultInterest);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({ amount, period, interest, note });
  };

  return (
    <Modal open={open} onClose={onClose} title="Approve Loan Application">
      <p className="text-sm text-gray-500">
        Are you sure you want to approve this loan application? Confirm the
        approval details below.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ₦
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Interest %
            </label>
            <div className="relative">
              <input
                type="number"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-4 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter notes"
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none"
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
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Disbursing..." : "Approve application"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
