export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex-1">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
