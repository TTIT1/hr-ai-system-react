import { useState } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { TextField } from '../common/FormField';
import { Card, CardBody } from '../common/Card';
import { useAttendance, useAttendanceActions, useEmployeeExcelSummary } from '../../hooks/useAttendance';

interface AttendancePanelProps {
  attendanceEmployeeId?: string | null;
  summaryEmployeeId?: string | null;
  year?: number;
  month?: number;
}

export function AttendancePanel({
  attendanceEmployeeId,
  summaryEmployeeId,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
}: AttendancePanelProps) {
  const [note, setNote] = useState('');
  const { today, summary } = useAttendance(attendanceEmployeeId, year, month);
  const excelSummary = useEmployeeExcelSummary(summaryEmployeeId, year, month);
  const actions = useAttendanceActions();

  if (!attendanceEmployeeId && !summaryEmployeeId) {
    return (
      <Card>
        <CardBody className="text-amber-600 bg-amber-50">
          Tài khoản này chưa có đủ mã nhân viên để chấm công.
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

  const formatScore = (score: number | undefined) => {
    if (score === undefined) return '-';
    return score.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  };

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Trạng thái hôm nay</p>
            <p className="mt-1.5 text-xl font-bold text-[#1b1b22]">
              {getTodayStatusText(today.data?.status)}
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Nhân viên</p>
            <p className="mt-1.5 truncate text-xl font-bold text-[#1b1b22]" title={excelSummary.data?.employeeName || summaryEmployeeId || ''}>
              {excelSummary.data?.employeeName || summaryEmployeeId || '-'}
            </p>
            <p className="mt-1 truncate text-xs font-medium text-[#8a8898]" title={excelSummary.data?.department || ''}>
              {excelSummary.data?.department || (summaryEmployeeId ? `Mã NV: ${summaryEmployeeId}` : 'Chưa có mã chấm công')}
            </p>
          </div>
          <div className="rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#58566a]">Tổng công tháng {month}/{year}</p>
            <p className="mt-1.5 text-xl font-bold text-[#1b1b22]">
              {excelSummary.isLoading ? 'Đang tải...' : formatScore(excelSummary.data?.totalScore)}
              <span className="text-xs font-medium text-[#8a8898]"> công</span>
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
              disabled={!attendanceEmployeeId}
              loading={actions.checkIn.isPending}
              onClick={() => attendanceEmployeeId && actions.checkIn.mutate({ employee_id: attendanceEmployeeId, note })}
              className="shadow-sm shadow-[#1f108e]/10 px-6"
            >
              Check-in (Vào ca)
            </Button>
            <Button
              variant="secondary"
              icon={<LogOut className="h-4 w-4" />}
              disabled={!attendanceEmployeeId}
              loading={actions.checkOut.isPending}
              onClick={() => attendanceEmployeeId && actions.checkOut.mutate({ employee_id: attendanceEmployeeId, note })}
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
