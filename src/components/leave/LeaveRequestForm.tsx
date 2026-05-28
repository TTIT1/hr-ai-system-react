import { useState } from 'react';
import { Button } from '../common/Button';
import { TextAreaField, TextField } from '../common/FormField';
import type { LeaveRequestCreate } from '../../types/leave.type';

export function LeaveRequestForm({ onSubmit, loading }: { onSubmit: (payload: LeaveRequestCreate) => void; loading?: boolean }) {
  const [form, setForm] = useState<LeaveRequestCreate>({ startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.startDate) next.startDate = 'Start date is required';
    if (!form.endDate) next.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) next.endDate = 'End date must be after start date';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); if (validate()) onSubmit(form); }}>
      <TextField label="Start date" type="date" value={form.startDate} error={errors.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} />
      <TextField label="End date" type="date" value={form.endDate} error={errors.endDate} onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))} />
      <div className="md:col-span-2">
        <TextAreaField label="Reason" value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} />
      </div>
      <div className="md:col-span-2"><Button type="submit" loading={loading}>Submit leave request</Button></div>
    </form>
  );
}
