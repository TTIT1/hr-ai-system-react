import { useEffect, useMemo, useState } from 'react';
import { Button } from '../common/Button';
import { SelectField, TextField } from '../common/FormField';
import { Tabs, TabList, Tab, TabPanel } from '../common/Tabs';
import { useEmployees } from '../../hooks/useEmployee';
import type { Department, Employee, EmployeeCreateRequest } from '../../types/employee.type';
import { AlertCircle } from 'lucide-react';
import { useUserRoleByEmployee } from '../../hooks/useUserRole';
import { useTranslation } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types/common.type';

interface EmployeeFormProps {
  departments: Department[];
  employee?: Employee | null;
  onSubmit: (payload: EmployeeCreateRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function EmployeeForm({ departments, employee, onSubmit, onCancel, loading }: EmployeeFormProps) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();

  // Query danh sách nhân viên đang làm việc để làm danh sách chọn quản lý
  const { data: employeesData } = useEmployees({ status: 'ACTIVE', size: 1000 });

  // Query thông tin vai trò người dùng (User Account) nếu đang chỉnh sửa nhân viên
  const { data: userRoleData } = useUserRoleByEmployee(employee?.id);
  const [role, setRole] = useState<Role>('EMPLOYEE');

  const canManageRole = currentUser?.role === 'ADMIN' || currentUser?.role === 'HR';

  useEffect(() => {
    if (userRoleData?.role) {
      setRole(userRoleData.role);
    }
  }, [userRoleData]);

  const [form, setForm] = useState<EmployeeCreateRequest>({
    idemployee: employee?.idemployee || '',
    fullname: employee?.full_name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department_id: employee?.department_id || departments[0]?.id || '',
    position: employee?.position || '',
    level: employee?.level || '',
    hire_date: employee?.hire_date || new Date().toISOString().slice(0, 10),
    birth_date: employee?.birth_date || '',
    gender: employee?.gender || '',
    id_number: employee?.id_number || '',

    // Thêm các trường nâng cao
    manager_level_1: employee?.manager_level_1 || '',
    manager_level_2: employee?.manager_level_2 || '',
    contract_type: employee?.contract_type || '',
    contract_effective_date: employee?.contract_effective_date || '',
    contract_expiry_date: employee?.contract_expiry_date || '',
    review_due_date: employee?.review_due_date || '',
    resignation_date: employee?.resignation_date || '',
    seniority: employee?.seniority || '',
    permanent_address: employee?.permanent_address || '',
    personal_email: employee?.personal_email || '',
    id_issue_date: employee?.id_issue_date || '',
    id_issue_place: employee?.id_issue_place || '',
    emergency_contact_name: employee?.emergency_contact_name || '',
    emergency_contact_relationship: employee?.emergency_contact_relationship || '',
    emergency_contact_phone: employee?.emergency_contact_phone || '',
    programming_language: employee?.programming_language || '',
    major: employee?.major || '',
    education_institution: employee?.education_institution || '',
    education_level: employee?.education_level || '',
    degree_year: employee?.degree_year || '',
    other_it_certificate: employee?.other_it_certificate || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof EmployeeCreateRequest, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Lọc ra danh sách quản lý tiềm năng (loại trừ chính nhân viên đang sửa)
  const managerOptions = useMemo(() => {
    const list = employeesData?.content || [];
    if (employee?.id) {
      return list.filter((emp) => emp.id !== employee.id);
    }
    return list;
  }, [employeesData, employee]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.idemployee.trim()) next.idemployee = 'Mã nhân viên không được để trống';
    if (!form.fullname.trim()) next.fullname = 'Họ và tên không được để trống';
    if (!form.email.trim()) next.email = 'Email công ty không được để trống';
    if (!form.department_id) next.department_id = 'Vui lòng chọn phòng ban';
    if (!form.hire_date) next.hire_date = 'Ngày vào làm không được để trống';
    if (form.phone && !/^[0-9]{10,11}$/.test(form.phone)) next.phone = 'Số điện thoại phải có 10-11 số';
    if (form.emergency_contact_phone && !/^[0-9]{10,11}$/.test(form.emergency_contact_phone)) {
      next.emergency_contact_phone = 'Số điện thoại liên hệ phải có 10-11 số';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Xác định tab nào có lỗi để hiển thị cảnh báo trực quan
  const hasBasicErrors = !!(errors.idemployee || errors.fullname || errors.email || errors.phone);
  const hasJobErrors = !!(errors.department_id || errors.hire_date);
  const hasContactErrors = !!errors.emergency_contact_phone;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (validate()) {
          // Chuẩn hóa degree_year sang number nếu có nhập
          const payload = {
            ...form,
            degree_year: form.degree_year ? Number(form.degree_year) : undefined,
            resignation_date: form.resignation_date || null,
            role: role,
          };
          onSubmit(payload);
        }
      }}
    >
      <Tabs defaultTab="basic">
        <TabList>
          <Tab id="basic">
            <span className="flex items-center gap-1.5">
              Thông tin cơ bản
              {hasBasicErrors && <AlertCircle className="h-4 w-4 text-red-500 fill-red-500/10" />}
            </span>
          </Tab>
          <Tab id="job">
            <span className="flex items-center gap-1.5">
              Công việc & Hợp đồng
              {hasJobErrors && <AlertCircle className="h-4 w-4 text-red-500 fill-red-500/10" />}
            </span>
          </Tab>
          <Tab id="management">Người quản lý & CMND</Tab>
          <Tab id="education">Học vấn & Kỹ năng</Tab>
          <Tab id="emergency">
            <span className="flex items-center gap-1.5">
              Liên hệ khẩn cấp
              {hasContactErrors && <AlertCircle className="h-4 w-4 text-red-500 fill-red-500/10" />}
            </span>
          </Tab>
          {canManageRole && (
            <Tab id="role">
              Tài khoản & Phân quyền
            </Tab>
          )}
        </TabList>

        {/* Tab 1: Thông tin cơ bản */}
        <TabPanel id="basic">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Mã nhân viên *"
              value={form.idemployee}
              error={errors.idemployee}
              disabled={!!employee && !!employee.idemployee}
              onChange={(event) => update('idemployee', event.target.value)}
              placeholder="VD: NV001"
            />
            <TextField
              label="Họ và tên *"
              value={form.fullname}
              error={errors.fullname}
              onChange={(event) => update('fullname', event.target.value)}
              placeholder="VD: Nguyễn Văn A"
            />
            <TextField
              label="Email công ty *"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="VD: nv001@company.com"
            />
            <TextField
              label="Số điện thoại"
              value={form.phone}
              error={errors.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="VD: 0912345678"
            />
            <TextField
              label="Email cá nhân"
              type="email"
              value={form.personal_email || ''}
              onChange={(event) => update('personal_email', event.target.value)}
              placeholder="VD: ca_nhan@gmail.com"
            />
            <TextField
              label="Địa chỉ thường trú"
              value={form.permanent_address || ''}
              onChange={(event) => update('permanent_address', event.target.value)}
              placeholder="VD: Cầu Giấy, Hà Nội"
            />
            <SelectField
              label="Giới tính"
              value={form.gender || ''}
              onChange={(event) => update('gender', event.target.value)}
            >
              <option value="">Chưa xác định</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </SelectField>
            <TextField
              label="Ngày sinh"
              type="date"
              value={form.birth_date || ''}
              onChange={(event) => update('birth_date', event.target.value)}
            />
          </div>
        </TabPanel>

        {/* Tab 2: Công việc & Hợp đồng */}
        <TabPanel id="job">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Phòng ban *"
              value={form.department_id}
              error={errors.department_id}
              onChange={(event) => update('department_id', event.target.value)}
            >
              <option value="">Chọn phòng ban</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Chức vụ"
              value={form.position || ''}
              onChange={(event) => update('position', event.target.value)}
              placeholder="VD: Developer, HR Specialist..."
            />
            <TextField
              label="Cấp bậc"
              value={form.level || ''}
              onChange={(event) => update('level', event.target.value)}
              placeholder="VD: Junior, Senior, Principal..."
            />
            <TextField
              label="Ngày vào làm *"
              type="date"
              value={form.hire_date}
              error={errors.hire_date}
              onChange={(event) => update('hire_date', event.target.value)}
            />
            <TextField
              label="Thâm niên"
              value={form.seniority || ''}
              onChange={(event) => update('seniority', event.target.value)}
              placeholder="VD: 1 năm, 6 tháng..."
            />
            <TextField
              label="Loại hợp đồng"
              value={form.contract_type || ''}
              onChange={(event) => update('contract_type', event.target.value)}
              placeholder="VD: Hợp đồng lao động 1 năm, Không xác định thời hạn..."
            />
            <TextField
              label="Ngày hợp đồng có hiệu lực"
              type="date"
              value={form.contract_effective_date || ''}
              onChange={(event) => update('contract_effective_date', event.target.value)}
            />
            <TextField
              label="Ngày hết hạn hợp đồng"
              type="date"
              value={form.contract_expiry_date || ''}
              onChange={(event) => update('contract_expiry_date', event.target.value)}
            />
            <TextField
              label="Ngày hẹn đánh giá tiếp theo"
              type="date"
              value={form.review_due_date || ''}
              onChange={(event) => update('review_due_date', event.target.value)}
            />
            <TextField
              label="Ngày nghỉ việc"
              type="date"
              value={form.resignation_date || ''}
              onChange={(event) => update('resignation_date', event.target.value)}
            />
          </div>
        </TabPanel>

        {/* Tab 3: Người quản lý & CMND */}
        <TabPanel id="management">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Người quản lý trực tiếp (Manager Level 1)"
              value={form.manager_level_1 || ''}
              onChange={(event) => update('manager_level_1', event.target.value)}
            >
              <option value="">Chọn quản lý cấp 1</option>
              {managerOptions.map((emp) => (
                <option key={emp.id} value={emp.full_name}>
                  {emp.full_name} ({emp.position || 'Nhân sự'})
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Người quản lý cấp trên (Manager Level 2)"
              value={form.manager_level_2 || ''}
              onChange={(event) => update('manager_level_2', event.target.value)}
            >
              <option value="">Chọn quản lý cấp 2</option>
              {managerOptions.map((emp) => (
                <option key={emp.id} value={emp.full_name}>
                  {emp.full_name} ({emp.position || 'Nhân sự'})
                </option>
              ))}
            </SelectField>

            <TextField
              label="Số CCCD/CMND"
              value={form.id_number || ''}
              onChange={(event) => update('id_number', event.target.value)}
              placeholder="VD: 001098765432"
            />
            <TextField
              label="Ngày cấp CCCD"
              type="date"
              value={form.id_issue_date || ''}
              onChange={(event) => update('id_issue_date', event.target.value)}
            />
            <TextField
              label="Nơi cấp CCCD"
              value={form.id_issue_place || ''}
              onChange={(event) => update('id_issue_place', event.target.value)}
              placeholder="VD: Cục CSQLHC về TTXH"
            />
          </div>
        </TabPanel>

        {/* Tab 4: Học vấn & Kỹ năng */}
        <TabPanel id="education">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Trình độ đào tạo"
              value={form.education_level || ''}
              onChange={(event) => update('education_level', event.target.value)}
              placeholder="VD: Đại học, Cao đẳng, Thạc sĩ..."
            />
            <TextField
              label="Chuyên ngành"
              value={form.major || ''}
              onChange={(event) => update('major', event.target.value)}
              placeholder="VD: Công nghệ thông tin, Quản trị nhân sự..."
            />
            <TextField
              label="Cơ sở đào tạo"
              value={form.education_institution || ''}
              onChange={(event) => update('education_institution', event.target.value)}
              placeholder="VD: Đại học Bách Khoa Hà Nội"
            />
            <TextField
              label="Năm tốt nghiệp"
              type="number"
              value={form.degree_year || ''}
              onChange={(event) => update('degree_year', event.target.value)}
              placeholder="VD: 2020"
            />
            <TextField
              label="Ngôn ngữ lập trình chính"
              value={form.programming_language || ''}
              onChange={(event) => update('programming_language', event.target.value)}
              placeholder="VD: Java, React, TypeScript..."
            />
            <TextField
              label="Chứng chỉ IT / Ngoại ngữ khác"
              value={form.other_it_certificate || ''}
              onChange={(event) => update('other_it_certificate', event.target.value)}
              placeholder="VD: AWS Solutions Architect, TOEIC 850..."
            />
          </div>
        </TabPanel>

        {/* Tab 5: Liên hệ khẩn cấp */}
        <TabPanel id="emergency">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Họ tên người liên hệ"
              value={form.emergency_contact_name || ''}
              onChange={(event) => update('emergency_contact_name', event.target.value)}
              placeholder="VD: Nguyễn Văn B"
            />
            <TextField
              label="Quan hệ"
              value={form.emergency_contact_relationship || ''}
              onChange={(event) => update('emergency_contact_relationship', event.target.value)}
              placeholder="VD: Bố, Mẹ, Vợ/Chồng..."
            />
            <TextField
              label="Số điện thoại khẩn cấp"
              value={form.emergency_contact_phone || ''}
              error={errors.emergency_contact_phone}
              onChange={(event) => update('emergency_contact_phone', event.target.value)}
              placeholder="VD: 0987654321"
            />
          </div>
        </TabPanel>

        {/* Tab 6: Phân quyền tài khoản */}
        {canManageRole && (
          <TabPanel id="role">
            <div className="rounded-xl border border-[#c8c4d5] bg-[#fdfcff] p-5 dark:border-[#2e2a3d] dark:bg-[#161424] space-y-4">
              <div className="flex flex-col gap-1 border-b border-[#e4e1eb] pb-3 dark:border-[#2e2a3d]">
                <h3 className="text-lg font-bold text-[#1b1b22] dark:text-[#e8e4f0]">
                  {t('modules.userRolesTitle') || 'Phân quyền tài khoản'}
                </h3>
                <p className="text-xs text-[#58566a] dark:text-[#9490a8]">
                  {t('modules.userRolesDesc') || 'Quản lý tài khoản đăng nhập và quyền truy cập hệ thống của nhân viên.'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Email đăng nhập"
                  value={form.email || ''}
                  disabled
                  helperText="Tài khoản đăng nhập hệ thống được liên kết qua Email công ty."
                />
                
                <SelectField
                  label={t('modules.role') || 'Vai trò hệ thống'}
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                >
                  <option value="EMPLOYEE">Nhân viên (EMPLOYEE)</option>
                  <option value="MANAGER">Quản lý (MANAGER)</option>
                  <option value="HR">Nhân sự (HR)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </SelectField>
              </div>

              {employee && userRoleData && (
                <div className="mt-4 grid gap-3 text-xs bg-[#f4f1fa] dark:bg-[#1e1c2e] p-3 rounded-lg text-[#58566a] dark:text-[#9490a8]">
                  <div className="flex justify-between">
                    <span className="font-semibold">Mã tài khoản (User ID):</span>
                    <span className="font-mono">{userRoleData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Trạng thái hoạt động:</span>
                    <span className={userRoleData.isActive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {userRoleData.isActive ? 'Đang hoạt động' : 'Bị khóa'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>
        )}
      </Tabs>

      {/* Nút hành động */}
      <div className="mt-2 flex justify-end gap-3 border-t border-[#e4e1eb] pt-4 dark:border-[#2e2a3d]">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-2.5">
            Hủy bỏ
          </Button>
        )}
        <Button type="submit" loading={loading} className="px-8 py-2.5 shadow-lg shadow-[#1f108e]/20">
          {employee ? 'Lưu thay đổi' : 'Thêm mới nhân viên'}
        </Button>
      </div>
    </form>
  );
}
