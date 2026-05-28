import { useState } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import { Card, CardBody } from '../common/Card';
import { useAttendance, useAttendanceActions } from '../../hooks/useAttendance';

export function AttendancePanel({ employeeId }: { employeeId?: string | null }) {
  const [note, setNote] = useState('');
  const { today, summary } = useAttendance(employeeId);
  const actions = useAttendanceActions();

  if (!employeeId) {
    return (
      <Card>
        <CardBody className="text-amber-600 bg-amber-50">
          Tài khoản này chưa được liên kết với mã nhân viên trong hệ thống.
        </CardBody>
      </Card>
    );
  }

  const getTodayStatusText = (status: string | undefined) => {
    if (!status) return 'Chưa check-in';
    if (status === 'ON_TIME') return 'Đúng giờ';
    if (status === 'LATE') return 'Đi muộn';
    return status;
  };

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Trạng thái hôm nay</p>
            <p className="mt-1.5 text-xl font-bold text-[#1b1b22]">
              {getTodayStatusText(today.data?.status)}
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Số ngày làm việc thực tế</p>
            <p className="mt-1.5 text-xl font-bold text-[#1b1b22]">
              {summary.data?.actualDays ?? 0} <span className="text-xs font-medium text-[#8a8898]">ngày</span>
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Tổng số giờ làm thêm (OT)</p>
            <p className="mt-1.5 text-xl font-bold text-[#1b1b22]">
              {summary.data?.totalOtHours ?? 0} <span className="text-xs font-medium text-[#8a8898]">giờ</span>
            </p>
          </div>
        </div>

        <TextField
          label="Ghi chú điểm danh"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Nhập ghi chú điểm danh (ví dụ: làm việc từ xa, đi công tác...)"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e1eb] pt-4">
          <div className="flex flex-wrap gap-3">
            <Button
              icon={<LogIn className="h-4 w-4" />}
              loading={actions.checkIn.isPending}
              onClick={() => actions.checkIn.mutate({ employee_id: employeeId, note })}
              className="shadow-sm shadow-[#1f108e]/10 px-6"
            >
              Check-in (Vào ca)
            </Button>
            <Button
              variant="secondary"
              icon={<LogOut className="h-4 w-4" />}
              loading={actions.checkOut.isPending}
              onClick={() => actions.checkOut.mutate({ employee_id: employeeId, note })}
              className="px-6"
            >
              Check-out (Ra ca)
            </Button>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a8898]">
            <Clock className="h-4 w-4 text-[#1f108e]" /> Múi giờ: Asia/Ho_Chi_Minh
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
