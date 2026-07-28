import Modal, { ModalFooter } from "./Modal";

import { formatNaira } from "@/features/loans/helpers/loanHelpers";

export default function UpdateAmountModal({
  open,
  onClose,
  onConfirm,
  currentAmountDue,
}) {
  const [action, setAction] = useState("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({ action, amount, note });
    setAmount("");
    setNote("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Amount Due">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount Due</label>
          <div className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-400 bg-gray-50">
            {formatNaira(currentAmountDue)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white"
            >
              <option value="add">Add to amount due</option>
              <option value="subtract">Subtract from amount due</option>
            </select>
          </div>
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
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">Note</label>
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
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium transition-colors"
        >
          Update amount
        </button>
      </ModalFooter>
    </Modal>
  );
}
