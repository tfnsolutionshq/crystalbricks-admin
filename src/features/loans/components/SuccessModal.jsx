import { Check } from "lucide-react";
import Modal from "./Modal";

/**
 * Generic "action succeeded" confirmation modal (checkmark + title +
 * subtitle + single Done button). Cross-feature atom — used after any
 * approve/reject/disburse/submit style action completes.
 */
export default function SuccessModal({
  open,
  onClose,
  label,
  title,
  subtitle,
  doneLabel = "Done",
}) {
  return (
    <Modal open={open} onClose={onClose} title={label} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
          <Check className="text-green-600" size={26} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium py-3 transition-colors cursor-pointer"
        >
          {doneLabel}
        </button>
      </div>
    </Modal>
  );
}
