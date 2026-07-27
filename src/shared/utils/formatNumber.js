export default function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-NG");
}
