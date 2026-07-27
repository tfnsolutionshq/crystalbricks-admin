const VARIANTS = {
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-orange-50 text-orange-500",
  danger: "bg-red-50 text-red-500",
  info: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  neutral: "bg-slate-100 text-slate-500",
};

export default function Badge({
  variant = "neutral",
  children,
  className = "",
}) {
  const colorClasses = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}
