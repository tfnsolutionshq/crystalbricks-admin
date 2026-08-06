import * as XLSX from "xlsx";
import formatDateTime from "./formatDateTime";
import formatNumber from "./formatNumber";

export default function exportToExcel(
  data,
  { fileName, sheetName = "Sheet1", columns },
) {
  if (!data?.length) {
    console.warn("exportToExcel: No data to export");
    return;
  }

  let rows = data;

  if (columns?.length) {
    rows = data.map((row) => {
      const mapped = {};
      columns.forEach(({ key, header, accessor }) => {
        let value = accessor
          ? accessor(row)
          : key.split(".").reduce((acc, part) => acc?.[part], row);

        if (value === undefined || value === null) {
          value = "N/A";
        }
        if (key === "status" && typeof value === "string") {
          value = value.charAt(0).toUpperCase() + value.slice(1);
        }
        if (key === "created_at" && typeof value === "string") {
          value = formatDateTime(value);
        }
        if (key === "amount" && typeof value === "string") {
          value = formatNumber(value);
        }
        mapped[header] = value;
      });
      return mapped;
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);

  if (columns?.length) {
    worksheet["!cols"] = columns.map((col) => ({ wch: col.width ?? 18 }));
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
}
