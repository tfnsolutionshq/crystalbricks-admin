import { Calendar } from "lucide-react";
import Modal, { ModalFooter } from "./Modal";

export default function AddRepaymentEntryModal({ open, onClose, onConfirm }) {
  const [amountDue, setAmountDue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({ amountDue, dueDate, note });
    setAmountDue("");
    setDueDate("");
    setNote("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Repayment Entry">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Amount Due</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ₦
            </span>
            <input
              type="text"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">Due Date</label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            />
            <Calendar
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
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
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium transition-colors cursor-pointer"
        >
          Add entry
        </button>
      </ModalFooter>
    </Modal>
  );
}
