"use client";

import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  actions,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <table className="w-full border-collapse border border-gray-200 text-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="border px-4 py-2">
              {col.header}
            </th>
          ))}
          {actions && <th className="border px-4 py-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick?.(row)} className="hover:bg-gray-50 cursor-pointer">
            {columns.map((col, i) => (
              <td key={i} className="border px-4 py-2">
                {typeof col.accessor === "function"
                  ? col.accessor(row)
                  : String(row[col.accessor])}
              </td>
            ))}
            {actions && <td className="border px-4 py-2">{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
