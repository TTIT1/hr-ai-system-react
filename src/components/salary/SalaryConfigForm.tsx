import { useState } from 'react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import { useTranslation } from '../../context/LanguageContext';
import type { SalaryConfigRequest } from '../../types/salary.type';

export function SalaryConfigForm({ employeeId, onSubmit, loading }: { employeeId?: string | null; onSubmit: (payload: SalaryConfigRequest) => void; loading?: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ baseSalary: '', bhxhSalary: '', allowancesJson: '{"transport":500000}', taxDependents: '0', effectiveDate: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');

  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!employeeId) return setError(t('salary.employeeRequired'));
        if (!form.baseSalary) return setError(t('salary.baseSalaryRequired'));
        onSubmit({
          employeeId,
          baseSalary: Number(form.baseSalary),
          bhxhSalary: form.bhxhSalary ? Number(form.bhxhSalary) : undefined,
          allowancesJson: form.allowancesJson,
          taxDependents: Number(form.taxDependents || 0),
          effectiveDate: form.effectiveDate,
        });
      }}
    >
      <TextField label={t('salary.baseSalary')} type="number" value={form.baseSalary} error={error} onChange={(event) => { setError(''); setForm((prev) => ({ ...prev, baseSalary: event.target.value })); }} />
      <TextField label={t('salary.bhxhSalary')} type="number" value={form.bhxhSalary} onChange={(event) => setForm((prev) => ({ ...prev, bhxhSalary: event.target.value }))} />
      <TextField label={t('salary.taxDependents')} type="number" value={form.taxDependents} onChange={(event) => setForm((prev) => ({ ...prev, taxDependents: event.target.value }))} />
      <TextField label={t('salary.effectiveDate')} type="date" value={form.effectiveDate} onChange={(event) => setForm((prev) => ({ ...prev, effectiveDate: event.target.value }))} />
      <div className="md:col-span-2">
        <TextField label={t('salary.allowancesJson')} value={form.allowancesJson} onChange={(event) => setForm((prev) => ({ ...prev, allowancesJson: event.target.value }))} />
      </div>
      <div className="md:col-span-3"><Button type="submit" loading={loading}>{t('salary.saveConfig')}</Button></div>
    </form>
  );
}
