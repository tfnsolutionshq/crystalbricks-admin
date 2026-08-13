export default function formatCurrency(amount, { decimals = 2 } = {}) {
  const value = Number(amount) || 0;
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
