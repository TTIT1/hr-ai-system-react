import { useState } from 'react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import type { KpiCreateRequest } from '../../types/performance.type';

export function KpiForm({ employeeId, onSubmit, loading }: { employeeId?: string | null; onSubmit: (payload: KpiCreateRequest) => void; loading?: boolean }) {
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
      <TextField label="Week start" type="date" value={form.weekStart} onChange={(event) => setForm((prev) => ({ ...prev, weekStart: event.target.value }))} />
      <TextField label="KPI score" type="number" value={form.kpiScore} onChange={(event) => setForm((prev) => ({ ...prev, kpiScore: event.target.value }))} />
      <TextField label="Tasks done" type="number" value={form.tasksDone} onChange={(event) => setForm((prev) => ({ ...prev, tasksDone: event.target.value }))} />
      <TextField label="Tasks total" type="number" value={form.tasksTotal} onChange={(event) => setForm((prev) => ({ ...prev, tasksTotal: event.target.value }))} />
      <TextField label="Work hours" type="number" value={form.workHours} onChange={(event) => setForm((prev) => ({ ...prev, workHours: event.target.value }))} />
      <TextField label="Late days" type="number" value={form.lateDays} onChange={(event) => setForm((prev) => ({ ...prev, lateDays: event.target.value }))} />
      <div className="md:col-span-3"><Button type="submit" loading={loading}>Save KPI</Button></div>
    </form>
  );
}
