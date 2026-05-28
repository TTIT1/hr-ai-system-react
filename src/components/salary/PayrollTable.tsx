import { CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { DataTable, type Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import type { PayrollRecord } from '../../types/salary.type';

const money = (value?: number) => value == null ? '-' : new Intl.NumberFormat('vi-VN').format(value);

export function PayrollTable({ records, onConfirm, onPaid }: { records: PayrollRecord[]; onConfirm?: (id: string) => void; onPaid?: (id: string) => void }) {
  const columns: Column<PayrollRecord>[] = [
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Period', accessor: (row) => `${row.month}/${row.year}` },
    { header: 'Actual days', accessor: 'actualDays' },
    { header: 'Net salary', accessor: (row) => money(row.netSalary) },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          {onConfirm && <Button variant="secondary" className="h-8 px-2" onClick={() => onConfirm(row.id)} aria-label="Confirm"><CheckCircle className="h-4 w-4" /></Button>}
          {onPaid && <Button variant="secondary" className="h-8 px-2" onClick={() => onPaid(row.id)} aria-label="Mark paid"><CreditCard className="h-4 w-4" /></Button>}
        </div>
      ),
    },
  ];
  return <DataTable data={records} columns={columns} keyField="id" />;
}
