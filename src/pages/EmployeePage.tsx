import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, UserMinus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { SelectField } from '../components/common/FormField';
import { EmployeeForm } from '../components/employee/EmployeeForm';
import { useDebounce } from '../hooks/useDebounce';
import { useDepartments, useEmployeeActions, useEmployees } from '../hooks/useEmployee';
import { StatusBadge } from '../components/common/StatusBadge';
import type { Employee } from '../types/employee.type';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function EmployeePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(0);
  const size = 10; // 10 nhân viên trên 1 trang

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  // Thiết lập Document Title
  useEffect(() => {
    document.title = 'Danh sách nhân viên | HRM System';
  }, []);

  const debouncedSearch = useDebounce(search);

  // Reset về trang đầu tiên nếu bộ lọc thay đổi
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status, department]);

  const filters = useMemo(
    () => ({
      status,
      search: debouncedSearch || undefined,
      department: department || undefined,
      page,
      size,
    }),
    [debouncedSearch, status, department, page, size],
  );

  const employees = useEmployees(filters);
  const departments = useDepartments();
  const employeeActions = useEmployeeActions();

  const employeeRows = employees.data?.content ?? [];
  const isLoading = employees.isLoading;

  const departmentMap = useMemo(
    () => new Map((departments.data ?? []).map((dept) => [dept.id, dept.name])),
    [departments.data],
  );

  const total = employees.data?.totalElements ?? 0;
  const totalPages = employees.data?.totalPages ?? 1;

  const startEntry = total === 0 ? 0 : page * size + 1;
  const endEntry = Math.min((page + 1) * size, total);

  // Xử lý resign nhân viên
  const handleResign = (employee: Employee) => {
    if (window.confirm(`Bạn có chắc chắn muốn cho nhân viên "${employee.full_name}" nghỉ việc không?`)) {
      employeeActions.resign.mutate(employee.id);
    }
  };

  return (
    <>
      <section className="w-full px-4 py-6">
        {/* Header Trang */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold tracking-[-0.02em] text-[#1b1b22]">Danh sách nhân viên</h1>
            <p className="mt-1 text-base text-[#464553]">Quản lý thông tin hồ sơ nhân sự và cơ cấu phòng ban trong hệ thống.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f108e] hover:bg-[#2b1ca0] transition-colors px-6 py-3 text-base font-semibold text-white shadow-md shadow-[#1f108e]/10 active:scale-95 duration-200"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-5 w-5" />
              Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#c8c4d5] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">TỔNG NHÂN SỰ (BỘ LỌC)</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-[#1b1b22]">{total.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">TRẠNG THÁI LỌC</p>
            <p className="mt-2 text-[24px] font-bold leading-[34px] text-[#1f108e]">
              {status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'}
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">PHÒNG BAN LỌC</p>
            <p className="mt-2 text-[20px] font-bold leading-[34px] text-[#464553] truncate" title={departmentMap.get(department) || 'Tất cả phòng ban'}>
              {departmentMap.get(department) || 'Tất cả phòng ban'}
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">TRANG HIỆN TẠI</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-[#1b1b22]">
              {page + 1} <span className="text-lg text-[#8a8898] font-normal">/ {totalPages}</span>
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {/* Tìm kiếm */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-[#8a8898]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo họ tên hoặc email..."
              className="h-11 w-full rounded-lg border border-[#c8c4d5] bg-white pl-10 pr-4 text-sm text-[#1b1b22] outline-none placeholder:text-[#8a8898] focus:border-[#1f108e] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] transition-all"
            />
          </div>

          {/* Lọc theo phòng ban */}
          <div className="[&_label]:hidden">
            <SelectField
              label="Phòng ban"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              <option value="">Tất cả phòng ban</option>
              {departments.data?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </SelectField>
          </div>

          {/* Lọc theo trạng thái */}
          <div className="[&_label]:hidden">
            <SelectField
              label="Trạng thái"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ACTIVE">Đang làm việc</option>
              <option value="RESIGNED">Đã nghỉ việc</option>
            </SelectField>
          </div>
        </div>

        {/* Table & Data */}
        <div className="overflow-hidden rounded-xl border border-[#c8c4d5] bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[2.1fr_1.4fr_1.4fr_0.9fr_0.6fr] border-b border-[#c8c4d5] bg-[#f6f2fc] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#464553]">
            <p>Nhân viên</p>
            <p>Phòng ban</p>
            <p>Vị trí / Chức vụ</p>
            <p>Trạng thái</p>
            <p className="text-right">Thao tác</p>
          </div>

          {/* Table Body - Loading Skeleton */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2.1fr_1.4fr_1.4fr_0.9fr_0.6fr] items-center border-b border-[rgba(200,196,213,0.35)] px-6 py-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#e4e1eb]" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-[#e4e1eb]" />
                    <div className="h-3 w-40 rounded bg-[#e4e1eb]" />
                  </div>
                </div>
                <div className="h-4 w-24 rounded bg-[#e4e1eb]" />
                <div className="h-4 w-20 rounded bg-[#e4e1eb]" />
                <div className="h-6 w-16 rounded-xl bg-[#e4e1eb]" />
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#e4e1eb]" />
                  <div className="h-8 w-8 rounded-lg bg-[#e4e1eb]" />
                </div>
              </div>
            ))}

          {/* Table Body - Actual Data */}
          {!isLoading &&
            employeeRows.map((employee) => (
              <div
                key={employee.id}
                className="grid grid-cols-[2.1fr_1.4fr_1.4fr_0.9fr_0.6fr] items-center border-b border-[rgba(200,196,213,0.35)] px-6 py-3.5 text-sm last:border-b-0 hover:bg-[#fcfaff] transition-colors"
              >
                {/* Employee Column */}
                <div className="flex items-center gap-3">
                  {employee.avatar_url ? (
                    <img
                      src={employee.avatar_url}
                      alt={employee.full_name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4e1eb] text-xs font-bold text-[#464553]">
                      {getInitials(employee.full_name)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-semibold text-[#1b1b22]">{employee.full_name}</p>
                      <span className="inline-flex items-center rounded-md bg-[#f0ecf6] px-1.5 py-0.5 text-[10px] font-bold text-[#58566a]">
                        {employee.idemployee || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-[#58566a]">{employee.email}</p>
                  </div>
                </div>

                {/* Department Column */}
                <p className="text-[15px] text-[#1b1b22] truncate pr-4">
                  {departmentMap.get(employee.department_id ?? '') ?? '-'}
                </p>

                {/* Role/Position Column */}
                <p className="text-[15px] text-[#1b1b22] truncate pr-4">
                  {employee.position ? (
                    <span>
                      {employee.position}
                      {employee.level && <span className="text-xs text-[#8a8898] ml-1">({employee.level})</span>}
                    </span>
                  ) : (
                    '-'
                  )}
                </p>

                {/* Status Column */}
                <div>
                  <StatusBadge status={employee.status} />
                </div>

                {/* Actions Column */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditing(employee);
                      setModalOpen(true);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] bg-white text-[#58566a] hover:bg-[#f6f2fc] hover:text-[#1f108e] hover:border-[#1f108e] transition-all duration-200"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  {employee.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleResign(employee)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#fecaca] bg-[#fff0f0] text-[#b42318] hover:bg-[#b42318] hover:text-white transition-all duration-200"
                      title="Cho nghỉ việc"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* Table Body - Empty State */}
          {!isLoading && employeeRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-[#58566a]">
              <p className="text-base font-semibold">Không tìm thấy nhân viên nào</p>
              <p className="text-xs text-[#8a8898] mt-1">Vui lòng thử lại với bộ lọc khác hoặc thêm nhân viên mới.</p>
            </div>
          )}

          {/* Table Footer - Dynamic Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#c8c4d5] bg-[#f6f2fc] px-6 py-4">
            <p className="text-xs font-semibold text-[#464553]">
              Hiển thị từ {startEntry} đến {endEntry} trong số {total.toLocaleString()} nhân sự
            </p>
            <div className="flex items-center gap-1.5 text-sm">
              {/* Button Previous */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0 || isLoading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] bg-white text-[#1b1b22] hover:bg-[#f6f2fc] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  disabled={isLoading}
                  className={`min-w-8 h-8 px-2.5 rounded-lg border font-semibold text-xs transition-all duration-200 ${
                    page === index
                      ? 'bg-[#1f108e] border-[#1f108e] text-white shadow-sm'
                      : 'border-[#c8c4d5] bg-white text-[#1b1b22] hover:bg-[#f6f2fc]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Button Next */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages - 1 || isLoading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] bg-white text-[#1b1b22] hover:bg-[#f6f2fc] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Thêm Mới / Chỉnh Sửa Nhân Viên */}
      <Modal
        isOpen={modalOpen}
        title={editing ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm mới nhân viên'}
        onClose={() => setModalOpen(false)}
        size="xl"
      >
        <EmployeeForm
          departments={departments.data || []}
          employee={editing}
          onSubmit={(payload) => {
            if (editing) {
              employeeActions.update.mutate(
                { id: editing.id, payload: { ...payload, full_name: payload.fullname } },
                { onSuccess: () => setModalOpen(false) },
              );
            } else {
              employeeActions.create.mutate(payload, { onSuccess: () => setModalOpen(false) });
            }
          }}
          loading={employeeActions.create.isPending || employeeActions.update.isPending}
        />
      </Modal>
    </>
  );
}
