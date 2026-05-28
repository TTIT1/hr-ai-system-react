import { useState } from 'react';
import { Button } from '../common/Button';
import { SelectField, TextAreaField, TextField } from '../common/FormField';
import type { Department } from '../../types/employee.type';
import type { CreateJobRequest } from '../../types/recruitment.type';

export function JobForm({ departments, onSubmit, loading }: { departments: Department[]; onSubmit: (payload: CreateJobRequest) => void; loading?: boolean }) {
  const [form, setForm] = useState({ title: '', description: '', requirements: '', skills: '', salaryRange: '', headcount: '1', deadline: '', departmentId: '' });
  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.title || !form.description || !form.departmentId) return;
        onSubmit({
          title: form.title,
          description: form.description,
          requirements: form.requirements,
          requiredSkillsJson: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
          salaryRange: form.salaryRange,
          headcount: Number(form.headcount || 1),
          deadline: form.deadline,
          departmentId: form.departmentId,
        });
      }}
    >
      <TextField label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
      <SelectField label="Department" value={form.departmentId} onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value }))}>
        <option value="">Select department</option>
        {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
      </SelectField>
      <div className="md:col-span-2"><TextAreaField label="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} /></div>
      <TextAreaField label="Requirements" value={form.requirements} onChange={(event) => setForm((prev) => ({ ...prev, requirements: event.target.value }))} />
      <TextField label="Skills, comma separated" value={form.skills} onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))} />
      <TextField label="Salary range" value={form.salaryRange} onChange={(event) => setForm((prev) => ({ ...prev, salaryRange: event.target.value }))} />
      <TextField label="Headcount" type="number" value={form.headcount} onChange={(event) => setForm((prev) => ({ ...prev, headcount: event.target.value }))} />
      <TextField label="Deadline" type="date" value={form.deadline} onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))} />
      <div className="md:col-span-2"><Button type="submit" loading={loading}>Create job</Button></div>
    </form>
  );
}
