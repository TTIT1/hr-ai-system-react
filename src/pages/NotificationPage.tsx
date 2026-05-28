import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { SelectField, TextAreaField, TextField } from '../components/common/FormField';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useNotificationActions, useNotifications } from '../hooks/useNotification';
import type { NotificationRequest } from '../types/notification.type';
import type { Role } from '../types/common.type';
import { useTranslation } from '../context/LanguageContext';

const targetRoles: Array<Role | 'ALL'> = ['ALL', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];

export default function NotificationPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = canAccess(user?.role, 'notificationManage');
  const notifications = useNotifications(canManage);
  const actions = useNotificationActions();
  const [form, setForm] = useState<NotificationRequest>({ title: '', content: '', targetRole: 'ALL' });

  const submit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    actions.create.mutate(
      {
        title: form.title.trim(),
        content: form.content.trim(),
        targetRole: form.targetRole || 'ALL',
      },
      { onSuccess: () => setForm({ title: '', content: '', targetRole: 'ALL' }) },
    );
  };

  const columns = [
    { header: t('modules.titleField'), accessor: (row: any) => row.title || '-' },
    { header: t('modules.message'), accessor: (row: any) => row.message || row.content || '-' },
    { header: t('modules.target'), accessor: (row: any) => row.targetRole || 'ALL' },
    { header: t('modules.created'), accessor: (row: any) => row.createdAt || '-' },
  ];

  return (
    <section className="w-full">
      <PageHeader title={t('modules.notificationsTitle')} description={t('modules.notificationsDesc')} />
      {canManage && (
        <Card>
          <CardHeader title={t('modules.createNotification')} />
          <CardBody className="grid gap-4 md:grid-cols-2">
            <TextField label={t('modules.titleField')} value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            <SelectField
              label={t('modules.target')}
              value={form.targetRole || 'ALL'}
              onChange={(event) => setForm((prev) => ({ ...prev, targetRole: event.target.value }))}
            >
              {targetRoles.map((role) => (
                <option key={role} value={role}>
                  {role === 'ALL' ? t('modules.allRoles') : role}
                </option>
              ))}
            </SelectField>
            <div className="md:col-span-2"><TextAreaField label={t('modules.content')} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} /></div>
            <div className="md:col-span-2"><Button onClick={submit} loading={actions.create.isPending}>{t('modules.createNotification')}</Button></div>
          </CardBody>
        </Card>
      )}
      <Card className="mt-5">
        <CardHeader title={t('modules.myNotifications')} />
        <CardBody><DataTable data={notifications.mine.data || []} keyField="id" columns={columns} /></CardBody>
      </Card>
      {canManage && (
        <Card className="mt-5">
          <CardHeader title={t('modules.allNotifications')} />
          <CardBody>
            <DataTable
              data={notifications.all.data || []}
              keyField="id"
              columns={[
                ...columns,
                { header: t('common.actions'), accessor: (row) => <Button className="h-8" variant="danger" onClick={() => actions.remove.mutate(row.id)}>{t('common.delete')}</Button> },
              ]}
            />
          </CardBody>
        </Card>
      )}
    </section>
  );
}
