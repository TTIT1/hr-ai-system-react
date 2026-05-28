import { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TextField } from '../components/common/FormField';
import { canAccess } from '../auth/permissions';
import { useAuth } from '../hooks/useAuth';
import { useCompanyConfigActions, useCompanyWorkPolicy } from '../hooks/useCompanyConfig';
import type { CompanyWorkPolicyRequest } from '../types/company-config.type';

const weekDays = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 7, label: 'CN' },
];

const defaultPolicy: CompanyWorkPolicyRequest = {
  workingDays: [1, 2, 3, 4, 5],
  workingTime: {
    checkIn: '09:00:00',
    checkOut: '18:00:00',
    allowedEarlyCheckInMinutes: 30,
  },
  lunchBreak: {
    start: '12:00:00',
    end: '13:00:00',
    durationMinutes: 60,
  },
  halfDayCoefficient: {
    morning: 0.4,
    afternoon: 0.6,
  },
  overtimeCoefficient: {
    workingDay: 1.5,
    dayOff: 2,
    officialHoliday: 3,
    compensatoryHoliday: 2,
  },
  monthlyAttendanceClosingDay: 10,
  standardWorkingDaysPerMonth: 22,
};

function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

function timeInputValue(value: string) {
  return value?.slice(0, 5) || '';
}

export default function CompanyConfigPage() {
  const { user } = useAuth();
  const canManage = canAccess(user?.role, 'companyStructureManage');
  const policy = useCompanyWorkPolicy();
  const actions = useCompanyConfigActions();
  const [form, setForm] = useState<CompanyWorkPolicyRequest>(defaultPolicy);

  useEffect(() => {
    if (policy.data) {
      setForm({
        workingDays: policy.data.workingDays || defaultPolicy.workingDays,
        workingTime: policy.data.workingTime || defaultPolicy.workingTime,
        lunchBreak: policy.data.lunchBreak || defaultPolicy.lunchBreak,
        halfDayCoefficient: policy.data.halfDayCoefficient || defaultPolicy.halfDayCoefficient,
        overtimeCoefficient: policy.data.overtimeCoefficient || defaultPolicy.overtimeCoefficient,
        monthlyAttendanceClosingDay: policy.data.monthlyAttendanceClosingDay ?? defaultPolicy.monthlyAttendanceClosingDay,
        standardWorkingDaysPerMonth: policy.data.standardWorkingDaysPerMonth ?? defaultPolicy.standardWorkingDaysPerMonth,
      });
    }
  }, [policy.data]);

  const toggleWorkingDay = (day: number) => {
    setForm((prev) => {
      const exists = prev.workingDays.includes(day);
      const workingDays = exists ? prev.workingDays.filter((item) => item !== day) : [...prev.workingDays, day].sort();
      return { ...prev, workingDays };
    });
  };

  const submit = () => {
    actions.updateWorkPolicy.mutate({
      ...form,
      workingTime: {
        ...form.workingTime,
        checkIn: normalizeTime(form.workingTime.checkIn),
        checkOut: normalizeTime(form.workingTime.checkOut),
      },
      lunchBreak: {
        ...form.lunchBreak,
        start: normalizeTime(form.lunchBreak.start),
        end: normalizeTime(form.lunchBreak.end),
      },
    });
  };

  return (
    <section className="w-full">
      <PageHeader
        title="Thông tin làm việc công ty"
        description="Ngày làm việc, giờ check-in/check-out, nghỉ trưa, hệ số nửa ngày, hệ số OT và ngày chốt công."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader
            title="Lịch làm việc"
            description={policy.data?.updatedBy ? `Cập nhật bởi ${policy.data.updatedBy} lúc ${policy.data.updatedAt || '-'}` : undefined}
          />
          <CardBody className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">Các ngày làm việc trong tuần</p>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const active = form.workingDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      disabled={!canManage}
                      onClick={() => toggleWorkingDay(day.value)}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${
                        active
                          ? 'border-[#1f108e] bg-[#1f108e] text-white'
                          : 'border-[#c8c4d5] bg-white text-[#464553]'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Thời gian check-in"
                type="time"
                step={1}
                disabled={!canManage}
                value={timeInputValue(form.workingTime.checkIn)}
                onChange={(event) => setForm((prev) => ({ ...prev, workingTime: { ...prev.workingTime, checkIn: event.target.value } }))}
              />
              <TextField
                label="Thời gian check-out"
                type="time"
                step={1}
                disabled={!canManage}
                value={timeInputValue(form.workingTime.checkOut)}
                onChange={(event) => setForm((prev) => ({ ...prev, workingTime: { ...prev.workingTime, checkOut: event.target.value } }))}
              />
              <TextField
                label="Cho phép check-in sớm (phút)"
                type="number"
                min={0}
                disabled={!canManage}
                value={form.workingTime.allowedEarlyCheckInMinutes}
                onChange={(event) => setForm((prev) => ({ ...prev, workingTime: { ...prev.workingTime, allowedEarlyCheckInMinutes: Number(event.target.value) } }))}
              />
              <TextField
                label="Bắt đầu nghỉ trưa"
                type="time"
                step={1}
                disabled={!canManage}
                value={timeInputValue(form.lunchBreak.start)}
                onChange={(event) => setForm((prev) => ({ ...prev, lunchBreak: { ...prev.lunchBreak, start: event.target.value } }))}
              />
              <TextField
                label="Kết thúc nghỉ trưa"
                type="time"
                step={1}
                disabled={!canManage}
                value={timeInputValue(form.lunchBreak.end)}
                onChange={(event) => setForm((prev) => ({ ...prev, lunchBreak: { ...prev.lunchBreak, end: event.target.value } }))}
              />
              <TextField
                label="Số phút nghỉ trưa"
                type="number"
                min={0}
                disabled={!canManage}
                value={form.lunchBreak.durationMinutes}
                onChange={(event) => setForm((prev) => ({ ...prev, lunchBreak: { ...prev.lunchBreak, durationMinutes: Number(event.target.value) } }))}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quy đổi công và OT" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Hệ số nghỉ sáng"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.halfDayCoefficient.morning}
                onChange={(event) => setForm((prev) => ({ ...prev, halfDayCoefficient: { ...prev.halfDayCoefficient, morning: Number(event.target.value) } }))}
              />
              <TextField
                label="Hệ số nghỉ chiều"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.halfDayCoefficient.afternoon}
                onChange={(event) => setForm((prev) => ({ ...prev, halfDayCoefficient: { ...prev.halfDayCoefficient, afternoon: Number(event.target.value) } }))}
              />
              <TextField
                label="OT ngày làm việc"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.overtimeCoefficient.workingDay}
                onChange={(event) => setForm((prev) => ({ ...prev, overtimeCoefficient: { ...prev.overtimeCoefficient, workingDay: Number(event.target.value) } }))}
              />
              <TextField
                label="OT ngày nghỉ"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.overtimeCoefficient.dayOff}
                onChange={(event) => setForm((prev) => ({ ...prev, overtimeCoefficient: { ...prev.overtimeCoefficient, dayOff: Number(event.target.value) } }))}
              />
              <TextField
                label="OT ngày lễ chính thức"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.overtimeCoefficient.officialHoliday}
                onChange={(event) => setForm((prev) => ({ ...prev, overtimeCoefficient: { ...prev.overtimeCoefficient, officialHoliday: Number(event.target.value) } }))}
              />
              <TextField
                label="OT ngày lễ bù"
                type="number"
                step={0.1}
                disabled={!canManage}
                value={form.overtimeCoefficient.compensatoryHoliday}
                onChange={(event) => setForm((prev) => ({ ...prev, overtimeCoefficient: { ...prev.overtimeCoefficient, compensatoryHoliday: Number(event.target.value) } }))}
              />
              <TextField
                label="Ngày chốt công hằng tháng"
                type="number"
                min={1}
                max={31}
                disabled={!canManage}
                value={form.monthlyAttendanceClosingDay}
                onChange={(event) => setForm((prev) => ({ ...prev, monthlyAttendanceClosingDay: Number(event.target.value) }))}
              />
              <TextField
                label="Công chuẩn tháng"
                type="number"
                min={1}
                disabled={!canManage}
                value={form.standardWorkingDaysPerMonth}
                onChange={(event) => setForm((prev) => ({ ...prev, standardWorkingDaysPerMonth: Number(event.target.value) }))}
              />
            </div>

            {canManage && (
              <div className="border-t border-[#e4e1eb] pt-4">
                <Button onClick={submit} loading={actions.updateWorkPolicy.isPending}>
                  Lưu thông tin làm việc
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
