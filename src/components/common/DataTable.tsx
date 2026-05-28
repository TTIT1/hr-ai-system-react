import { memo } from 'react';
import { useTranslation } from '../../context/LanguageContext';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  emptyText?: string;
}

function DataTableBase<T extends object>({
  data,
  columns,
  keyField,
  emptyText,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const resolvedEmptyText = emptyText || t('common.noRecords');

  return (
    <div className="overflow-x-auto rounded-lg border border-[#c8c4d5] bg-white">
      <table className="min-w-full divide-y divide-[#c8c4d5] text-sm">
        <thead>
          <tr className="bg-[#f6f2fc]">
            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#464553] ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(200,196,213,0.35)] bg-white">
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-sm text-[#6d6b7e]" colSpan={columns.length}>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full border border-[#c8c4d5] bg-[#f6f2fc]" />
                  <span>{resolvedEmptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String((row as Record<string, unknown>)[String(keyField)])}
                className="transition-colors duration-150 hover:bg-[#faf7fe]"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-3.5 text-[#1b1b22] ${column.className || ''}`}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : ((row as Record<string, unknown>)[String(column.accessor)] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = memo(DataTableBase) as typeof DataTableBase;
