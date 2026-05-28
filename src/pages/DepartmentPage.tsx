import { useEffect, useState } from 'react';
import {
  Building2,
  ChevronRight,
  Edit2,
  FolderTree,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { TextField, SelectField } from '../components/common/FormField';
import { Button } from '../components/common/Button';
import { useDepartments, useDepartmentActions } from '../hooks/useEmployee';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { departmentApi } from '../api/employee.api';
import { canAccess } from '../auth/permissions';
import type { Department, DepartmentCreateRequest } from '../types/employee.type';

// ─── Department Form (inline) ────────────────────────────────────────────────
interface DeptFormState {
  name: string;
  parent_id: string;
  manager_id: string;
}

function DepartmentFormFields({
  form,
  setForm,
  departments,
  excludeId,
  errors,
}: {
  form: DeptFormState;
  setForm: React.Dispatch<React.SetStateAction<DeptFormState>>;
  departments: Department[];
  excludeId?: string;
  errors: Record<string, string>;
}) {
  const available = departments.filter((d) => d.id !== excludeId);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <TextField
          label="Tên phòng ban *"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="VD: Phòng Kỹ thuật, Phòng HR..."
        />
      </div>
      <SelectField
        label="Phòng ban cha"
        value={form.parent_id}
        onChange={(e) => setForm((p) => ({ ...p, parent_id: e.target.value }))}
      >
        <option value="">— Không có phòng ban cha —</option>
        {available.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Mã quản lý (Manager ID)"
        value={form.manager_id}
        onChange={(e) => setForm((p) => ({ ...p, manager_id: e.target.value }))}
        placeholder="VD: NV002"
      />
    </div>
  );
}

// ─── Children Drawer ──────────────────────────────────────────────────────────
function ChildrenDrawer({
  dept,
  onClose,
}: {
  dept: Department;
  onClose: () => void;
}) {
  const { data: children, isLoading } = useQuery({
    queryKey: ['departments', dept.id, 'children'],
    queryFn: () => departmentApi.children(dept.id),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-[#464553] dark:text-[#9490a8]">
        <Building2 className="h-4 w-4 text-[#1f108e] dark:text-[#a78bfa]" />
        <span>
          Phòng ban cha: <strong className="text-[#1b1b22] dark:text-[#e8e4f0]">{dept.name}</strong>
        </span>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-[#8a8898] dark:text-[#5a5670]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải...</span>
        </div>
      ) : children && children.length > 0 ? (
        <ul className="divide-y divide-[#e4e1eb] dark:divide-[#2e2a3d]">
          {children.map((child) => (
            <li key={child.id} className="flex items-center gap-3 py-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-[#1f108e] dark:text-[#a78bfa]" />
              <div>
                <p className="text-sm font-semibold text-[#1b1b22] dark:text-[#e8e4f0]">{child.name}</p>
                {child.manager_id && (
                  <p className="text-xs text-[#8a8898] dark:text-[#5a5670]">Manager: {child.manager_id}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-[#8a8898] dark:text-[#5a5670]">
          Không có phòng ban con nào.
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepartmentPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [childrenTarget, setChildrenTarget] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  const [form, setForm] = useState<DeptFormState>({ name: '', parent_id: '', manager_id: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: departments = [], isLoading } = useDepartments();
  const actions = useDepartmentActions();
  const canManageDepartment = canAccess(user?.role, 'departmentManage');

  useEffect(() => {
    document.title = 'Quản lý phòng ban | HRM System';
  }, []);

  // Build parent name map
  const parentMap = new Map(departments.map((d) => [d.id, d.name]));

  // Filter departments by search
  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.manager_id && d.manager_id.toLowerCase().includes(search.toLowerCase())),
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Tên phòng ban không được để trống';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => {
    if (!canManageDepartment) return;
    setForm({ name: '', parent_id: '', manager_id: '' });
    setFormErrors({});
    setCreateOpen(true);
  };

  const openEdit = (dept: Department) => {
    if (!canManageDepartment) return;
    setForm({
      name: dept.name,
      parent_id: dept.parent_id || '',
      manager_id: dept.manager_id || '',
    });
    setFormErrors({});
    setEditTarget(dept);
  };

  const handleCreate = () => {
    if (!canManageDepartment) return;
    if (!validateForm()) return;
    const payload: DepartmentCreateRequest = {
      name: form.name.trim(),
      parent_id: form.parent_id || null,
      manager_id: form.manager_id || null,
    };
    actions.create.mutate(payload, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleUpdate = () => {
    if (!canManageDepartment) return;
    if (!editTarget || !validateForm()) return;
    const payload: DepartmentCreateRequest = {
      name: form.name.trim(),
      parent_id: form.parent_id || null,
      manager_id: form.manager_id || null,
    };
    actions.update.mutate(
      { id: editTarget.id, payload },
      { onSuccess: () => setEditTarget(null) },
    );
  };

  const handleDelete = () => {
    if (!canManageDepartment) return;
    if (!deleteTarget) return;
    actions.remove.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const rootCount = departments.filter((d) => !d.parent_id).length;
  const childCount = departments.filter((d) => !!d.parent_id).length;

  return (
    <>
      <section className="w-full px-4 py-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold tracking-[-0.02em] text-[#1b1b22] dark:text-[#e8e4f0]">
              Quản lý phòng ban
            </h1>
            <p className="mt-1 text-base text-[#464553] dark:text-[#9490a8]">
              Xem, tạo, sửa và xoá các phòng ban trong cơ cấu tổ chức.
            </p>
          </div>
          {canManageDepartment && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f108e] hover:bg-[#2b1ca0] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca] transition-colors px-6 py-3 text-base font-semibold text-white shadow-md shadow-[#1f108e]/20 active:scale-95 duration-200"
            >
              <Plus className="h-5 w-5" />
              Thêm phòng ban
            </button>
          )}
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          {[
            {
              label: 'TỔNG PHÒNG BAN',
              value: departments.length,
              icon: Building2,
              color: 'text-[#1f108e] dark:text-[#a78bfa]',
            },
            {
              label: 'PHÒNG BAN GỐC',
              value: rootCount,
              icon: FolderTree,
              color: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: 'PHÒNG BAN CON',
              value: childCount,
              icon: Users,
              color: 'text-amber-600 dark:text-amber-400',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#13111f] p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553] dark:text-[#9490a8]">
                    {stat.label}
                  </p>
                </div>
                <p className="text-[36px] font-bold leading-none text-[#1b1b22] dark:text-[#e8e4f0]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Search ─────────────────────────────────────────────────── */}
        <div className="mb-6 relative flex items-center max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-[#8a8898] dark:text-[#5a5670]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên phòng ban hoặc mã quản lý..."
            className="h-11 w-full rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#13111f] pl-10 pr-4 text-sm text-[#1b1b22] dark:text-[#e8e4f0] outline-none placeholder:text-[#8a8898] dark:placeholder:text-[#5a5670] focus:border-[#1f108e] dark:focus:border-[#7c6ff5] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] dark:focus:ring-[rgba(124,111,245,0.2)] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 text-[#8a8898] dark:text-[#5a5670] hover:text-[#1b1b22] dark:hover:text-[#e8e4f0] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Table ──────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#13111f] shadow-sm">
          {/* Table Head */}
          <div className="grid grid-cols-[2fr_1.6fr_1.2fr_0.8fr] border-b border-[#c8c4d5] dark:border-[#2e2a3d] bg-[#f6f2fc] dark:bg-[#1a1826] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#464553] dark:text-[#9490a8]">
            <p>Tên phòng ban</p>
            <p>Phòng ban cha</p>
            <p>Manager ID</p>
            <p className="text-right">Thao tác</p>
          </div>

          {/* Loading skeleton */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1.6fr_1.2fr_0.8fr] items-center border-b border-[rgba(200,196,213,0.35)] dark:border-[rgba(46,42,61,0.4)] px-6 py-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                  <div className="h-4 w-36 rounded bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                </div>
                <div className="h-4 w-28 rounded bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                <div className="h-4 w-16 rounded bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                  <div className="h-8 w-8 rounded-lg bg-[#e4e1eb] dark:bg-[#2e2a3d]" />
                </div>
              </div>
            ))}

          {/* Data rows */}
          {!isLoading &&
            filtered.map((dept) => {
              const parentName = dept.parent_id ? parentMap.get(dept.parent_id) : null;
              return (
                <div
                  key={dept.id}
                  className="grid grid-cols-[2fr_1.6fr_1.2fr_0.8fr] items-center border-b border-[rgba(200,196,213,0.35)] dark:border-[rgba(46,42,61,0.4)] px-6 py-3.5 text-sm last:border-b-0 hover:bg-[#fcfaff] dark:hover:bg-[#1e1c2e] transition-colors"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0ecf6] dark:bg-[#252235] text-[#1f108e] dark:text-[#a78bfa]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1b1b22] dark:text-[#e8e4f0]">{dept.name}</p>
                      <p className="text-[11px] text-[#8a8898] dark:text-[#5a5670] font-mono">{dept.id.slice(0, 8)}...</p>
                    </div>
                  </div>

                  {/* Parent */}
                  <div>
                    {parentName ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#f0ecf6] dark:bg-[#252235] px-2 py-1 text-xs font-semibold text-[#58566a] dark:text-[#9490a8]">
                        <ChevronRight className="h-3 w-3" />
                        {parentName}
                      </span>
                    ) : (
                      <span className="text-xs text-[#8a8898] dark:text-[#5a5670] italic">Phòng ban gốc</span>
                    )}
                  </div>

                  {/* Manager ID */}
                  <p className="text-[#464553] dark:text-[#9490a8]">
                    {dept.manager_id || <span className="italic text-[#8a8898] dark:text-[#5a5670]">—</span>}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setChildrenTarget(dept)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1a1826] text-[#58566a] dark:text-[#9490a8] hover:bg-[#f0ecf6] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#a78bfa] hover:border-[#1f108e] dark:hover:border-[#7c6ff5] transition-all duration-200"
                      title="Xem phòng ban con"
                    >
                      <FolderTree className="h-3.5 w-3.5" />
                    </button>
                    {canManageDepartment && (
                      <>
                        <button
                          onClick={() => openEdit(dept)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1a1826] text-[#58566a] dark:text-[#9490a8] hover:bg-[#f0ecf6] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#a78bfa] hover:border-[#1f108e] dark:hover:border-[#7c6ff5] transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(dept)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#fecaca] dark:border-[#7f1d1d] bg-[#fff0f0] dark:bg-[#2d1313] text-[#b42318] dark:text-[#f87171] hover:bg-[#b42318] dark:hover:bg-[#ef4444] hover:text-white transition-all duration-200"
                          title="Xoá phòng ban"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-[#58566a] dark:text-[#9490a8]">
              <Building2 className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-base font-semibold">
                {search ? 'Không tìm thấy phòng ban phù hợp' : 'Chưa có phòng ban nào'}
              </p>
              <p className="text-xs text-[#8a8898] dark:text-[#5a5670] mt-1">
                {search ? 'Thử từ khoá khác.' : 'Nhấn "Thêm phòng ban" để bắt đầu.'}
              </p>
            </div>
          )}

          {/* Footer */}
          {!isLoading && departments.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#c8c4d5] dark:border-[#2e2a3d] bg-[#f6f2fc] dark:bg-[#1a1826] px-6 py-4">
              <p className="text-xs font-semibold text-[#464553] dark:text-[#9490a8]">
                Hiển thị {filtered.length} / {departments.length} phòng ban
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Modal: Tạo phòng ban ─────────────────────────────────────── */}
      <Modal isOpen={createOpen && canManageDepartment} title="Thêm phòng ban mới" onClose={() => setCreateOpen(false)} size="md">
        <div className="flex flex-col gap-6">
          <DepartmentFormFields
            form={form}
            setForm={setForm}
            departments={departments}
            errors={formErrors}
          />
          <div className="flex justify-end gap-3 border-t border-[#e4e1eb] dark:border-[#2e2a3d] pt-4">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="px-6 py-2.5">
              Hủy bỏ
            </Button>
            <Button
              type="button"
              loading={actions.create.isPending}
              onClick={handleCreate}
              className="px-8 py-2.5"
            >
              Tạo phòng ban
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Chỉnh sửa phòng ban ───────────────────────────────── */}
      <Modal
        isOpen={!!editTarget && canManageDepartment}
        title={`Chỉnh sửa: ${editTarget?.name}`}
        onClose={() => setEditTarget(null)}
        size="md"
      >
        <div className="flex flex-col gap-6">
          <DepartmentFormFields
            form={form}
            setForm={setForm}
            departments={departments}
            excludeId={editTarget?.id}
            errors={formErrors}
          />
          <div className="flex justify-end gap-3 border-t border-[#e4e1eb] dark:border-[#2e2a3d] pt-4">
            <Button type="button" variant="outline" onClick={() => setEditTarget(null)} className="px-6 py-2.5">
              Hủy bỏ
            </Button>
            <Button
              type="button"
              loading={actions.update.isPending}
              onClick={handleUpdate}
              className="px-8 py-2.5"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Xem phòng ban con ─────────────────────────────────── */}
      <Modal
        isOpen={!!childrenTarget}
        title={`Phòng ban con của: ${childrenTarget?.name}`}
        onClose={() => setChildrenTarget(null)}
        size="sm"
      >
        {childrenTarget && <ChildrenDrawer dept={childrenTarget} onClose={() => setChildrenTarget(null)} />}
      </Modal>

      {/* ── Modal: Xác nhận xoá ──────────────────────────────────────── */}
      <Modal
        isOpen={!!deleteTarget && canManageDepartment}
        title="Xác nhận xoá phòng ban"
        onClose={() => setDeleteTarget(null)}
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[#464553] dark:text-[#9490a8]">
            Bạn có chắc muốn xoá phòng ban{' '}
            <strong className="text-[#b42318] dark:text-[#f87171]">"{deleteTarget?.name}"</strong>? Hành động này
            không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3 border-t border-[#e4e1eb] dark:border-[#2e2a3d] pt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} className="px-6 py-2.5">
              Hủy bỏ
            </Button>
            <button
              onClick={handleDelete}
              disabled={actions.remove.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-[#b42318] hover:bg-[#991b1b] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-colors px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {actions.remove.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Xoá phòng ban
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
