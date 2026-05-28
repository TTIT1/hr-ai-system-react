import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { TextAreaField, TextField } from '../components/common/FormField';
import { StatusBadge } from '../components/common/StatusBadge';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useOvertime, useOvertimeActions } from '../hooks/useOvertime';
import type { OvertimeCreateRequest } from '../types/overtime.type';

export default function OvertimePage() {
  const { user, employeeRecordId } = useAuth();
  const canManage = canAccess(user?.role, 'overtimeManage');
  const overtime = useOvertime(employeeRecordId, canManage);
  const actions = useOvertimeActions();
  const [form, setForm] = useState<Omit<OvertimeCreateRequest, 'employeeId'>>({ workDate: '', startTime: '18:00:00', endTime: '20:00:00', reason: '' });

  const normalizeTime = (value: string) => (value.length === 5 ? `${value}:00` : value);

  const submit = () => {
    if (!employeeRecordId || !form.workDate || !form.startTime || !form.endTime) return;
    actions.request.mutate(
      { employeeId: employeeRecordId, ...form, startTime: normalizeTime(form.startTime), endTime: normalizeTime(form.endTime) },
      { onSuccess: () => setForm({ workDate: '', startTime: '18:00:00', endTime: '20:00:00', reason: '' }) },
    );
  };

  const columns = [
    { header: 'Employee', accessor: (row: any) => row.employee?.fullName || row.employee?.email || '-' },
    { header: 'Date', accessor: (row: any) => row.workDate || '-' },
    { header: 'Time', accessor: (row: any) => `${row.startTime || '-'} - ${row.endTime || '-'}` },
    { header: 'Reason', accessor: (row: any) => row.reason || '-' },
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status || 'PENDING'} /> },
  ];

  return (
    <section className="w-full">
      <PageHeader title="Overtime" description="Đăng ký và duyệt tăng ca theo quyền." />
      <Card>
        <CardHeader title="Request overtime" />
        <CardBody className="grid gap-4 md:grid-cols-3">
          <TextField label="Ngày tăng ca" type="date" value={form.workDate} onChange={(event) => setForm((prev) => ({ ...prev, workDate: event.target.value }))} />
          <TextField label="Giờ bắt đầu" type="time" step={1} value={form.startTime} onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))} />
          <TextField label="Giờ kết thúc" type="time" step={1} value={form.endTime} onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))} />
          <div className="md:col-span-3"><TextAreaField label="Lý do" value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} /></div>
          <div className="md:col-span-3"><Button disabled={!employeeRecordId} onClick={submit} loading={actions.request.isPending}>Submit request</Button></div>
        </CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="My overtime requests" />
        <CardBody><DataTable data={overtime.mine.data || []} keyField="id" columns={columns} /></CardBody>
      </Card>
      {canManage && (
        <Card className="mt-5">
          <CardHeader title="Overtime approvals" />
          <CardBody>
            <DataTable
              data={overtime.all.data || []}
              keyField="id"
              columns={[
                ...columns,
                {
                  header: 'Actions',
                  accessor: (row) => (
                    <div className="flex gap-2">
                      <Button className="h-8" onClick={() => actions.review.mutate({ id: row.id, payload: { approved: true } })}>Approve</Button>
                      <Button className="h-8" variant="danger" onClick={() => actions.review.mutate({ id: row.id, payload: { approved: false } })}>Reject</Button>
                    </div>
                  ),
                },
              ]}
            />
          </CardBody>
        </Card>
      )}
    </section>
  );
}
