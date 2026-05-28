import { useState } from 'react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import type { UploadCvParams } from '../../types/recruitment.type';

export function CvUploadForm({ jobId, onSubmit, loading }: { jobId?: string | null; onSubmit: (file: File, params: UploadCvParams) => void; loading?: boolean }) {
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
      <TextField label="Candidate name" value={form.candidateName} onChange={(event) => setForm((prev) => ({ ...prev, candidateName: event.target.value }))} />
      <TextField label="Candidate email" value={form.candidateEmail} onChange={(event) => setForm((prev) => ({ ...prev, candidateEmail: event.target.value }))} />
      <TextField label="Candidate phone" value={form.candidatePhone} onChange={(event) => setForm((prev) => ({ ...prev, candidatePhone: event.target.value }))} />
      <label className="block md:col-span-3">
        <span className="mb-1 block text-sm font-medium text-ink">CV file</span>
        <input className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      </label>
      <div className="md:col-span-3"><Button type="submit" loading={loading} disabled={!file || !jobId}>Upload CV</Button></div>
    </form>
  );
}
