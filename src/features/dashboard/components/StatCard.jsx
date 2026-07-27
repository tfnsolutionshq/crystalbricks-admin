export default function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex-1 min-w-55">
      <div
        className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-6`}
      >
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
