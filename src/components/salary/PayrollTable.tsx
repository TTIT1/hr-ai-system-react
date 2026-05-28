import { CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { DataTable, type Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { useTranslation } from '../../context/LanguageContext';
import type { PayrollRecord } from '../../types/salary.type';

const money = (value?: number) => value == null ? '-' : new Intl.NumberFormat('vi-VN').format(value);

export function PayrollTable({ records, onConfirm, onPaid }: { records: PayrollRecord[]; onConfirm?: (id: string) => void; onPaid?: (id: string) => void }) {
  const { t } = useTranslation();
  const columns: Column<PayrollRecord>[] = [
    { header: t('salary.employee'), accessor: 'employeeName' },
    { header: t('salary.period'), accessor: (row) => `${row.month}/${row.year}` },
    { header: t('salary.actualDays'), accessor: 'actualDays' },
    { header: t('salary.netSalary'), accessor: (row) => money(row.netSalary) },
    { header: t('salary.status'), accessor: (row) => <StatusBadge status={row.status} /> },
    {
      header: t('common.actions'),
      accessor: (row) => (
        <div className="flex gap-2">
          {onConfirm && <Button variant="secondary" className="h-8 px-2" onClick={() => onConfirm(row.id)} aria-label={t('common.confirm')}><CheckCircle className="h-4 w-4" /></Button>}
          {onPaid && <Button variant="secondary" className="h-8 px-2" onClick={() => onPaid(row.id)} aria-label={t('common.save')}><CreditCard className="h-4 w-4" /></Button>}
        </div>
      ),
    },
  ];
  return <DataTable data={records} columns={columns} keyField="id" />;
}
