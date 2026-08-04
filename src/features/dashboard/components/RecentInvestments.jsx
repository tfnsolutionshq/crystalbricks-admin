import { Link } from "react-router-dom";

export default function RecentInvestments({ investments }) {
  return (
    <div className="flex-1 min-w-[320px] bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Recent Investments</h3>
        <Link
          to="/contributions"
          className="text-sm text-green-600 font-medium hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="divide-y divide-gray-100 max-h-105 overflow-y-auto">
        {investments.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
