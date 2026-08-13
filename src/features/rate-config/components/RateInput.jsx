export default function RateInput({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-pink-300">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm text-gray-900 focus:outline-none disabled:text-gray-500 disabled:cursor-default bg-transparent"
      />
      <span className="text-sm text-gray-400">%</span>
    </div>
  );
}
