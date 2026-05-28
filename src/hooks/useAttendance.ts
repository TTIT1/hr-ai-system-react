import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { attendanceApi } from '../api/attendance.api';
import type { AttendanceCheckRequest } from '../types/attendance.type';
import { getErrorMessage } from '../utils/errors';

export function useAttendance(employeeId?: string | null, year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
  return {
    today: useQuery({
      queryKey: ['attendance', 'today', employeeId],
      queryFn: () => attendanceApi.today(employeeId as string),
      enabled: Boolean(employeeId),
      retry: false,
    }),
    month: useQuery({
      queryKey: ['attendance', 'month', employeeId, year, month],
      queryFn: () => attendanceApi.month(employeeId as string, year, month),
      enabled: Boolean(employeeId),
    }),
    summary: useQuery({
      queryKey: ['attendance', 'summary', employeeId, year, month],
      queryFn: () => attendanceApi.summary(employeeId as string, year, month),
      enabled: Boolean(employeeId),
    }),
  };
}

export function useAttendanceActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['attendance'] });
  return {
    checkIn: useMutation({
      mutationFn: (payload: AttendanceCheckRequest) => attendanceApi.checkIn(payload),
      onSuccess: () => {
        toast.success('Checked in successfully');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    checkOut: useMutation({
      mutationFn: (payload: AttendanceCheckRequest) => attendanceApi.checkOut(payload),
      onSuccess: () => {
        toast.success('Checked out successfully');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}

// React Query hooks for HR / Admin Excel attendance management
export function useExcelAttendance(year: number, month: number, enabled = true) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['attendance-excel'] });

  const summaryQuery = useQuery({
    queryKey: ['attendance-excel', 'summary', year, month],
    queryFn: () => attendanceApi.getSummary(year, month),
    enabled,
  });

  const calculateMutation = useMutation({
    mutationFn: ({ file, year, month }: { file: File; year: number; month: number }) =>
      attendanceApi.calculate(file, year, month),
    onSuccess: (data) => {
      toast.success(
        `Xử lý thành công! Đã lưu ${data.savedRecords} dòng chi tiết và ${data.savedSummaries} dòng tổng hợp cho ${data.totalEmployees} nhân sự.`
      );
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const calculateExportMutation = useMutation({
    mutationFn: ({ file, year, month }: { file: File; year: number; month: number }) =>
      attendanceApi.calculateExport(file, year, month),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cham_cong_ket_qua_${variables.month}_${variables.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất file tính công thành công!');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    summary: summaryQuery,
    calculate: calculateMutation,
    calculateExport: calculateExportMutation,
  };
}

export function useEmployeeExcelSummary(employeeId: string | null | undefined, year: number, month: number) {
  return useQuery({
    queryKey: ['attendance-excel', 'employee-summary', employeeId, year, month],
    queryFn: () => attendanceApi.getSummaryByEmployee(employeeId as string, year, month),
    enabled: Boolean(employeeId),
    retry: false,
  });
}
