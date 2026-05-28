import { useState } from 'react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import type { UploadCvParams } from '../../types/recruitment.type';
import { useTranslation } from '../../context/LanguageContext';

export function CvUploadForm({ jobId, onSubmit, loading }: { jobId?: string | null; onSubmit: (file: File, params: UploadCvParams) => void; loading?: boolean }) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ candidateName: '', candidateEmail: '', candidatePhone: '' });
  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (file && jobId) onSubmit(file, { jobId, ...form });
      }}
    >
      <TextField label={t('recruitment.candidateName')} value={form.candidateName} onChange={(event) => setForm((prev) => ({ ...prev, candidateName: event.target.value }))} />
      <TextField label={t('recruitment.candidateEmail')} value={form.candidateEmail} onChange={(event) => setForm((prev) => ({ ...prev, candidateEmail: event.target.value }))} />
      <TextField label={t('recruitment.candidatePhone')} value={form.candidatePhone} onChange={(event) => setForm((prev) => ({ ...prev, candidatePhone: event.target.value }))} />
      <label className="block md:col-span-3">
        <span className="mb-1 block text-sm font-medium text-ink">{t('recruitment.cvFile')}</span>
        <input className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      </label>
      <div className="md:col-span-3"><Button type="submit" loading={loading} disabled={!file || !jobId}>{t('recruitment.uploadCv')}</Button></div>
    </form>
  );
}
