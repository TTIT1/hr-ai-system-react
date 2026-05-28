import { useState } from 'react';
import { Button } from '../common/Button';
import { TextAreaField, TextField } from '../common/FormField';
import { useTranslation } from '../../context/LanguageContext';
import type { LeaveRequestCreate } from '../../types/leave.type';

export function LeaveRequestForm({ onSubmit, loading }: { onSubmit: (payload: LeaveRequestCreate) => void; loading?: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<LeaveRequestCreate>({ startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.startDate) next.startDate = t('leave.startDateRequired');
    if (!form.endDate) next.endDate = t('leave.endDateRequired');
    if (form.startDate && form.endDate && form.endDate < form.startDate) next.endDate = t('leave.endDateAfterStart');
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); if (validate()) onSubmit(form); }}>
      <TextField label={t('leave.startDate')} type="date" value={form.startDate} error={errors.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} />
      <TextField label={t('leave.endDate')} type="date" value={form.endDate} error={errors.endDate} onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))} />
      <div className="md:col-span-2">
        <TextAreaField label={t('leave.reason')} value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} />
      </div>
      <div className="md:col-span-2"><Button type="submit" loading={loading}>{t('leave.submitRequest')}</Button></div>
    </form>
  );
}
