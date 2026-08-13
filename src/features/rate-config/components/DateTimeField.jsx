export default function DateTimeField({
  label,
  value,
  onChange,
  icon: Icon,
  disabled,
  helperText,
}) {
  return (
    <div className="flex-1 min-w-55">
      <label className="block text-sm text-gray-500 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
        />
        <Icon
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{helperText}</p>
    </div>
  );
}
