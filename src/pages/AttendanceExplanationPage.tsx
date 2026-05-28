import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { TextAreaField, TextField } from '../components/common/FormField';
import { StatusBadge } from '../components/common/StatusBadge';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useAttendanceExplanationActions, useAttendanceExplanations } from '../hooks/useAttendanceExplanation';
import { useTranslation } from '../context/LanguageContext';
import type { AttendanceExplanationCreateRequest } from '../types/attendance-explanation.type';

export default function AttendanceExplanationPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Backend phân quyền rõ ràng:
  // - EMPLOYEE: submit + xem "của tôi" (/mine?employeeId=...)
  // - HR / ADMIN / MANAGER: xem tất cả (/all) + phê duyệt (/review)
  const canSubmit = canAccess(user?.role, 'attendanceExplanationSubmit');   // chỉ EMPLOYEE
  const canViewMine = canAccess(user?.role, 'attendanceExplanationMine');   // chỉ EMPLOYEE
  const canManage = canAccess(user?.role, 'attendanceExplanationManage');   // HR / ADMIN / MANAGER

  const explanations = useAttendanceExplanations(user?.employeeId, canManage);
  const actions = useAttendanceExplanationActions();
  const [form, setForm] = useState<AttendanceExplanationCreateRequest>({ workDate: '', reason: '' });

  const submit = () => {
    if (!form.workDate || !form.reason.trim()) return;
    actions.create.mutate(form, { onSuccess: () => setForm({ workDate: '', reason: '' }) });
  };

  const sharedColumns = [
    { header: t('modules.employee'), accessor: (row: any) => row.employeeName || row.employeeId || '-' },
    { header: t('modules.date'), accessor: (row: any) => row.workDate || row.date || '-' },
    { header: t('modules.reason'), accessor: (row: any) => row.reason || '-' },
    { header: t('modules.status'), accessor: (row: any) => <StatusBadge status={row.status || 'PENDING'} /> },
    { header: t('modules.reviewerNote'), accessor: (row: any) => row.reviewerNote || '-' },
  ];

  return (
    <section className="w-full">
      <PageHeader title={t('modules.explanationsTitle')} description={t('modules.explanationsDesc')} />

      {/* ── Chỉ EMPLOYEE: form gửi giải trình ── */}
      {canSubmit && (
        <Card>
          <CardHeader title={t('modules.submitExplanation')} />
          <CardBody className="grid gap-4 md:grid-cols-2">
            <TextField
              label={t('modules.date')}
              type="date"
              value={form.workDate}
              onChange={(event) => setForm((prev) => ({ ...prev, workDate: event.target.value }))}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label={t('modules.reason')}
                value={form.reason}
                onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={submit} loading={actions.create.isPending}>
                {t('modules.submitRequest')}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Chỉ EMPLOYEE: danh sách giải trình của tôi ── */}
      {canViewMine && (
        <Card className="mt-5">
          <CardHeader title={t('modules.myExplanations')} />
          <CardBody>
            <DataTable data={explanations.mine.data || []} keyField="id" columns={sharedColumns} />
          </CardBody>
        </Card>
      )}

      {/* ── Chỉ HR / ADMIN / MANAGER: duyệt giải trình ── */}
      {canManage && (
        <Card className="mt-5">
          <CardHeader title={t('modules.explanationApprovals')} />
          <CardBody>
            <DataTable
              data={explanations.all.data || []}
              keyField="id"
              columns={[
                ...sharedColumns,
                {
                  header: t('common.actions'),
                  accessor: (row: any) => (
                    <div className="flex gap-2">
                      {row.status === 'PENDING' && (
                        <>
                          <Button
                            className="h-8"
                            onClick={() =>
                              actions.review.mutate({ id: row.id, payload: { approved: true } })
                            }
                            loading={actions.review.isPending}
                          >
                            {t('common.approve')}
                          </Button>
                          <Button
                            className="h-8"
                            variant="danger"
                            onClick={() =>
                              actions.review.mutate({ id: row.id, payload: { approved: false } })
                            }
                            loading={actions.review.isPending}
                          >
                            {t('common.reject')}
                          </Button>
                        </>
                      )}
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
