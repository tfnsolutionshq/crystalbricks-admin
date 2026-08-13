import { useState } from "react";
import Modal, { ModalFooter } from "./Modal";

export default function RequestDocumentModal({ open, onClose, onConfirm }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({ title, note });
    setTitle("");
    setNote("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Additional Document">
      <p className="text-sm text-gray-500">
        The status of this loan will be changed to &ldquo;On hold&rdquo;.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
          />
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
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-medium transition-colors"
        >
          Submit request
        </button>
      </ModalFooter>
    </Modal>
  );
}
