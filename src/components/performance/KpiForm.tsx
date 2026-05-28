import { useState } from 'react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import { useTranslation } from '../../context/LanguageContext';
import type { KpiCreateRequest } from '../../types/performance.type';

export function KpiForm({ employeeId, onSubmit, loading }: { employeeId?: string | null; onSubmit: (payload: KpiCreateRequest) => void; loading?: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ weekStart: '', kpiScore: '', tasksDone: '', tasksTotal: '', workHours: '', lateDays: '0' });
  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!employeeId || !form.weekStart) return;
        onSubmit({
          employeeId,
          weekStart: form.weekStart,
          kpiScore: Number(form.kpiScore || 0),
          tasksDone: Number(form.tasksDone || 0),
          tasksTotal: Number(form.tasksTotal || 0),
          workHours: Number(form.workHours || 0),
          lateDays: Number(form.lateDays || 0),
        });
      }}
    >
      <TextField label={t('performance.weekStart')} type="date" value={form.weekStart} onChange={(event) => setForm((prev) => ({ ...prev, weekStart: event.target.value }))} />
      <TextField label={t('performance.kpiScore')} type="number" value={form.kpiScore} onChange={(event) => setForm((prev) => ({ ...prev, kpiScore: event.target.value }))} />
      <TextField label={t('performance.tasksDone')} type="number" value={form.tasksDone} onChange={(event) => setForm((prev) => ({ ...prev, tasksDone: event.target.value }))} />
      <TextField label={t('performance.tasksTotal')} type="number" value={form.tasksTotal} onChange={(event) => setForm((prev) => ({ ...prev, tasksTotal: event.target.value }))} />
      <TextField label={t('performance.workHours')} type="number" value={form.workHours} onChange={(event) => setForm((prev) => ({ ...prev, workHours: event.target.value }))} />
      <TextField label={t('performance.lateDays')} type="number" value={form.lateDays} onChange={(event) => setForm((prev) => ({ ...prev, lateDays: event.target.value }))} />
      <div className="md:col-span-3"><Button type="submit" loading={loading}>{t('performance.saveKpi')}</Button></div>
    </form>
  );
}
