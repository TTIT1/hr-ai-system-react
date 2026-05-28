import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { TextAreaField, TextField } from '../components/common/FormField';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useHolidayActions, useHolidays } from '../hooks/useHoliday';
import type { Holiday, HolidayRequest } from '../types/holiday.type';
import { useTranslation } from '../context/LanguageContext';

const emptyForm: HolidayRequest = { name: '', holidayDate: '', description: '', paid: true };

export default function HolidayPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = canAccess(user?.role, 'holidayManage');
  const holidays = useHolidays();
  const actions = useHolidayActions();
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<HolidayRequest>(emptyForm);

  const submit = () => {
    if (!form.name.trim() || !form.holidayDate) return;
    if (editingId) {
      actions.update.mutate({ id: editingId, payload: form }, { onSuccess: () => { setEditingId(null); setForm(emptyForm); } });
    } else {
      actions.create.mutate(form, { onSuccess: () => setForm(emptyForm) });
    }
  };

  const edit = (holiday: Holiday) => {
    setEditingId(holiday.id);
    setForm({ name: holiday.name, holidayDate: holiday.holidayDate || '', description: holiday.description || '', paid: holiday.paid ?? true });
  };

  return (
    <section className="w-full">
      <PageHeader title={t('modules.holidaysTitle')} description={t('modules.holidaysDesc')} />
      {canManage && (
        <Card>
          <CardHeader title={editingId ? t('modules.updateHoliday') : t('modules.createHoliday')} />
          <CardBody className="grid gap-4 md:grid-cols-2">
            <TextField label={t('modules.name')} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label={t('modules.date')} type="date" value={form.holidayDate} onChange={(event) => setForm((prev) => ({ ...prev, holidayDate: event.target.value }))} />
            <label className="flex items-center gap-2 text-sm font-semibold text-[#58566a]">
              <input type="checkbox" checked={form.paid ?? true} onChange={(event) => setForm((prev) => ({ ...prev, paid: event.target.checked }))} />
              {t('modules.paid')}
            </label>
            <div className="md:col-span-2"><TextAreaField label={t('modules.description')} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} /></div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={submit} loading={actions.create.isPending || actions.update.isPending}>{editingId ? t('modules.saveHoliday') : t('modules.createHoliday')}</Button>
              {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t('common.cancel')}</Button>}
            </div>
          </CardBody>
        </Card>
      )}
      <Card className="mt-5">
        <CardHeader title={t('modules.holidayList')} />
        <CardBody>
          <DataTable
            data={holidays.data || []}
            keyField="id"
            columns={[
              { header: t('modules.name'), accessor: 'name' },
              { header: t('modules.date'), accessor: (row) => row.holidayDate || '-' },
              { header: t('modules.paid'), accessor: (row) => row.paid === false ? t('common.no') : t('common.yes') },
              { header: t('modules.description'), accessor: (row) => row.description || '-' },
              {
                header: t('common.actions'),
                accessor: (row) => canManage ? (
                  <div className="flex gap-2">
                    <Button className="h-8" variant="secondary" onClick={() => edit(row)}>{t('common.edit')}</Button>
                    <Button className="h-8" variant="danger" onClick={() => actions.remove.mutate(row.id)}>{t('common.delete')}</Button>
                  </div>
                ) : '-',
              },
            ]}
          />
        </CardBody>
      </Card>
    </section>
  );
}
