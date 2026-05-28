import { Check, X } from 'lucide-react';
import { Button } from '../common/Button';
import { DataTable, type Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { useTranslation } from '../../context/LanguageContext';
import type { LeaveRequest } from '../../types/leave.type';

export function LeaveTable({ requests, onApprove }: { requests: LeaveRequest[]; onApprove?: (id: number, ok: boolean) => void }) {
  const { t } = useTranslation();
  const columns: Column<LeaveRequest>[] = [
    { header: t('leave.id'), accessor: 'id' },
    { header: t('leave.dates'), accessor: (row) => `${row.startDate} → ${row.endDate}` },
    { header: t('leave.days'), accessor: 'days' },
    { header: t('leave.reason'), accessor: 'reason' },
    { header: t('leave.status'), accessor: (row) => <StatusBadge status={row.status} /> },
    {
      header: t('common.actions'),
      accessor: (row) =>
        onApprove && row.status === 'PENDING' ? (
          <div className="flex gap-2">
            <Button className="h-8 px-2" onClick={() => onApprove(row.id, true)} aria-label={t('common.approve')}><Check className="h-4 w-4" /></Button>
            <Button className="h-8 px-2" variant="danger" onClick={() => onApprove(row.id, false)} aria-label={t('common.reject')}><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <span className="text-xs text-muted">{t('leave.noAction')}</span>
        ),
    },
  ];
  return <DataTable data={requests} columns={columns} keyField="id" />;
}
