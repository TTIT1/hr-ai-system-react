import { Check, X } from 'lucide-react';
import { Button } from '../common/Button';
import { DataTable, type Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import type { LeaveRequest } from '../../types/leave.type';

export function LeaveTable({ requests, onApprove }: { requests: LeaveRequest[]; onApprove?: (id: number, ok: boolean) => void }) {
  const columns: Column<LeaveRequest>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Dates', accessor: (row) => `${row.startDate} to ${row.endDate}` },
    { header: 'Days', accessor: 'days' },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: (row) =>
        onApprove && row.status === 'PENDING' ? (
          <div className="flex gap-2">
            <Button className="h-8 px-2" onClick={() => onApprove(row.id, true)} aria-label="Approve"><Check className="h-4 w-4" /></Button>
            <Button className="h-8 px-2" variant="danger" onClick={() => onApprove(row.id, false)} aria-label="Reject"><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <span className="text-xs text-muted">No action</span>
        ),
    },
  ];
  return <DataTable data={requests} columns={columns} keyField="id" />;
}
