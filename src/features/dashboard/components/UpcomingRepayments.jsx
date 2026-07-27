import { REPAYMENTS } from "@/features/dashboard/mocks/dashboardMockData";

export default function UpcomingRepayments() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1 min-w-55">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        Upcoming Repayments
      </h3>
      <ul className="space-y-3">
        {REPAYMENTS.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-xs text-gray-400 mb-1">{r.due}</p>
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
            </div>
            <span className="text-sm font-bold text-gray-900">{r.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
