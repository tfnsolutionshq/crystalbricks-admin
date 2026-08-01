import { useState } from "react";

import Card from "@/shared/components/Card";

const TAG_VARIANT = {
  Approved: "green",
  Rejected: "red",
  Comment: "neutral",
};

export default function NotesTab({ note, onPostComment }) {
  const [comment, setComment] = useState("");

  const handlePost = () => {
    if (!comment.trim()) return;
    onPostComment?.(comment.trim());
    setComment("");
  };

  return (
    <Card>
      <h3 className="text-base font-bold text-gray-900 mb-5">Notes</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comment thread */}
        <div>{note}</div>

        {/* Leave a comment */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Leave a comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter comment here"
            rows={5}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handlePost}
              className="px-6 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
