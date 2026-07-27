const STYLES = {
  Deposit: "text-amber-600",
  Borrowings: "text-indigo-500",
};

export default function TypeLabel({ type }) {
  return <span className={`text-sm font-medium ${STYLES[type]}`}>{type}</span>;
}
