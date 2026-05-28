import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { SelectField, TextAreaField, TextField } from '../components/common/FormField';
import { StatusBadge } from '../components/common/StatusBadge';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useProjectActions, useProjects } from '../hooks/useProject';
import { useDepartments, useEmployees } from '../hooks/useEmployee';
import type { Project, ProjectRequest } from '../types/project.type';
import { useTranslation } from '../context/LanguageContext';

const emptyForm: ProjectRequest = { name: '', description: '', departmentId: '', managerId: '', startDate: '', endDate: '', status: 'ACTIVE' };

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManage = canAccess(user?.role, 'projectManage');
  const projects = useProjects();
  const departments = useDepartments();
  const employees = useEmployees({ status: 'ACTIVE', page: 0, size: 200 });
  const actions = useProjectActions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectRequest>(emptyForm);

  const submit = () => {
    if (!form.name.trim()) return;
    const payload = { ...form, name: form.name.trim() };
    if (editingId) {
      actions.update.mutate({ id: editingId, payload }, { onSuccess: () => { setEditingId(null); setForm(emptyForm); } });
    } else {
      actions.create.mutate(payload, { onSuccess: () => setForm(emptyForm) });
    }
  };

  const edit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      name: project.name || '',
      description: project.description || '',
      departmentId: project.department?.id || '',
      managerId: project.manager?.id || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      status: String(project.status || 'ACTIVE'),
    });
  };

  return (
    <section className="w-full">
      <PageHeader title={t('modules.projectsTitle')} description={t('modules.projectsDesc')} />
      {canManage && (
        <Card>
          <CardHeader title={editingId ? t('modules.updateProject') : t('modules.createProject')} />
          <CardBody className="grid gap-4 md:grid-cols-2">
            <TextField label="Tên dự án" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <SelectField label={t('modules.department')} value={form.departmentId || ''} onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value || null }))}>
              <option value="">{t('modules.noDepartment')}</option>
              {(departments.data || []).map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
            </SelectField>
            <SelectField label={t('modules.manager')} value={form.managerId || ''} onChange={(event) => setForm((prev) => ({ ...prev, managerId: event.target.value || null }))}>
              <option value="">{t('modules.noManager')}</option>
              {(employees.data?.content || []).map((employee) => <option key={employee.id} value={employee.id}>{employee.full_name} ({employee.email})</option>)}
            </SelectField>
            <TextField label={t('modules.start')} type="date" value={form.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} />
            <TextField label={t('modules.end')} type="date" value={form.endDate} onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))} />
            <div className="md:col-span-2">
              <TextAreaField label={t('modules.description')} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={submit} loading={actions.create.isPending || actions.update.isPending}>{editingId ? t('modules.saveProject') : t('modules.createProject')}</Button>
              {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t('common.cancel')}</Button>}
            </div>
          </CardBody>
        </Card>
      )}
      <Card className="mt-5">
        <CardHeader title={t('modules.projectList')} />
        <CardBody>
          <DataTable
            data={projects.data || []}
            keyField="id"
            columns={[
              { header: t('modules.name'), accessor: (row) => row.name || '-' },
              { header: t('modules.department'), accessor: (row) => row.department?.name || '-' },
              { header: t('modules.manager'), accessor: (row) => row.manager?.fullName || row.manager?.email || '-' },
              { header: t('modules.start'), accessor: (row) => row.startDate || '-' },
              { header: t('modules.end'), accessor: (row) => row.endDate || '-' },
              { header: t('modules.status'), accessor: (row) => <StatusBadge status={row.status || 'OPEN'} /> },
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
