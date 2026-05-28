import { useState } from 'react';
import { Button } from '../common/Button';
import { SelectField, TextField } from '../common/FormField';
import type { Department, DepartmentCreateRequest } from '../../types/employee.type';

export function DepartmentForm({ departments, onSubmit, loading }: { departments: Department[]; onSubmit: (payload: DepartmentCreateRequest) => void; loading?: boolean }) {
  const [form, setForm] = useState<DepartmentCreateRequest>({ name: '', parent_id: '', manager_id: '' });
  const [error, setError] = useState('');

  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.name.trim()) {
          setError('Tên phòng ban không được để trống');
          return;
        }
        onSubmit({ ...form, parent_id: form.parent_id || null, manager_id: form.manager_id || null });
        setForm({ name: '', parent_id: '', manager_id: '' });
      }}
    >
      <TextField label="Tên phòng ban" value={form.name} error={error} onChange={(event) => { setError(''); setForm((prev) => ({ ...prev, name: event.target.value })); }} placeholder="VD: Phòng Kỹ thuật, Phòng HR..." />
      <SelectField label="Phòng ban cha" value={form.parent_id || ''} onChange={(event) => setForm((prev) => ({ ...prev, parent_id: event.target.value }))}>
        <option value="">Không có phòng ban cha</option>
        {departments.map((department) => (
          <option key={department.id} value={department.id}>{department.name}</option>
        ))}
      </SelectField>
      <TextField label="Mã quản lý (Manager ID)" value={form.manager_id || ''} onChange={(event) => setForm((prev) => ({ ...prev, manager_id: event.target.value }))} placeholder="VD: NV002" />
      <div className="md:col-span-3">
        <Button type="submit" loading={loading} className="w-full">Tạo phòng ban</Button>
      </div>
    </form>
  );
}
