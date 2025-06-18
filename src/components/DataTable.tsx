"use client";

import React from "react";

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-green-600 dark:bg-green-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-3 py-4 sm:px-6 sm:py-4 text-left text-sm font-semibold text-white uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th className="px-3 py-4 sm:px-6 sm:py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={`${
                onRowClick 
                  ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200' 
                  : ''
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className={`px-3 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                >
                  {String(item[column.accessor] || '')}
                </td>
              ))}
              {actions && (
                <td className="px-3 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📚</div>
          <div className="text-lg font-medium mb-2">No books found</div>
          <div className="text-sm">Add your first book to get started</div>
        </div>
      )}
    </div>
  );
}
