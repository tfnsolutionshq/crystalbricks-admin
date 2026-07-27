export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 min-w-55">
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
