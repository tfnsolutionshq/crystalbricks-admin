import StatusBadge from "@/features/products/components/StatusBadge";

export default function ProductsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="font-medium pb-3 pr-4">Name</th>
            <th className="font-medium pb-3 pr-4">Type</th>
            <th className="font-medium pb-3 pr-4">Rate</th>
            <th className="font-medium pb-3 pr-4">Status</th>
            <th className="font-medium pb-3">Date created</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50">
              <td className="py-4 pr-4 text-gray-900 font-semibold max-w-55 truncate">
                {row.name}
              </td>
              <td className="py-4 pr-4 text-gray-500">{row.type}</td>
              <td className="py-4 pr-4 text-gray-900">{row.rate}</td>
              <td className="py-4 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4 text-gray-500">{row.dateCreated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
