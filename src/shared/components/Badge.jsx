// Colour map for every status/kyc/type pill that shows up across the designs.
const BADGE_STYLES = {
  // KYC / general success states
  Verified: "bg-green-50 text-green-600",
  Completed: "bg-green-50 text-green-600",
  Approved: "bg-green-50 text-green-600",
  Success: "bg-green-50 text-green-600",
  Active: "bg-blue-50 text-blue-600",
  Paid: "bg-green-50 text-green-600",
  Matured: "bg-purple-50 text-purple-600",
  // Neutral / in-progress
  Pending: "bg-gray-100 text-gray-500",
  Waiting: "bg-orange-50 text-orange-600",
  "Under Review": "bg-amber-50 text-amber-700",
  // Negative states
  Rejected: "bg-red-50 text-red-500",
  Inactive: "bg-red-50 text-red-500",
  Failed: "bg-red-50 text-red-500",
  Blocked: "bg-red-50 text-red-500",
  Cancelled: "bg-red-50 text-red-500",
  "User Cancelled": "bg-red-50 text-red-500",
  Defaulted: "bg-red-50 text-red-500",
  // Customer type
  Individual: "bg-purple-50 text-purple-500",
  Corporate: "bg-blue-50 text-blue-500",
};

export default function Badge({ children }) {
  const style = BADGE_STYLES[children] || "bg-gray-100 text-gray-500";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {children}
    </span>
  );
}
