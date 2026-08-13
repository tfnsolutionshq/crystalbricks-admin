import { ChevronDown } from "lucide-react";

export function TextInput({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-500 mb-2">{label}</label>
      )}
      <input
        {...props}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B]"
      />
    </div>
  );
}

export function TextArea({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-500 mb-2">{label}</label>
      )}
      <textarea
        rows={4}
        {...props}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B] resize-none"
      />
    </div>
  );
}

export function Select({ label, options, display, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-500 mb-2">{label}</label>
      )}
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B] bg-white"
        >
          <option value="" disabled hidden>
            Select
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {display ? display(opt) : opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

export function SuffixInput({ label, suffix, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-500 mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          {...props}
          className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none whitespace-nowrap">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 accent-[#111827]"
      />
      {label}
    </label>
  );
}
