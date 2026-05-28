import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import { AttendancePanel } from '../components/attendance/AttendancePanel';
import { useAuth } from '../hooks/useAuth';
import { useAttendance, useExcelAttendance, useEmployeeExcelSummary } from '../hooks/useAttendance';
import { Tabs, TabList, Tab, TabPanel } from '../components/common/Tabs';
import { Button } from '../components/common/Button';
import { SelectField } from '../components/common/FormField';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Search,
  Calendar,
  AlertCircle,
  FileDown,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const isHRorAdmin = user?.role === 'HR' || user?.role === 'ADMIN';

  // Personal attendance state
  const [personalYear, setPersonalYear] = useState(new Date().getFullYear());
  const [personalMonth, setPersonalMonth] = useState(new Date().getMonth() + 1);
  const personalAttendance = useAttendance(user?.employeeId, personalYear, personalMonth);
  const personalExcelSummary = useEmployeeExcelSummary(user?.employeeId, personalYear, personalMonth);

  // HR/Admin Excel attendance state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const excelAttendance = useExcelAttendance(selectedYear, selectedMonth);

  useEffect(() => {
    document.title = 'Chấm công | HRM System';
  }, []);

  // Reset file selection when year/month changes
  useEffect(() => {
    setFile(null);
  }, [selectedYear, selectedMonth]);

  // Handle file select
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Submit calculation
  const handleCalculate = () => {
    if (!file) return;
    excelAttendance.calculate.mutate(
      { file, year: selectedYear, month: selectedMonth },
      {
        onSuccess: () => {
          setFile(null);
        },
      }
    );
  };

  // Submit calculation and export
  const handleCalculateExport = () => {
    if (!file) return;
    excelAttendance.calculateExport.mutate({ file, year: selectedYear, month: selectedMonth });
  };

  // Generate days in selected month for grid headers
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const dayKeys = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  }, [daysInMonth]);

  // Filter summary rows
  const filteredSummary = useMemo(() => {
    const list = excelAttendance.summary.data || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (row) =>
        row.employeeName.toLowerCase().includes(q) ||
        row.employeeId.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q)
    );
  }, [excelAttendance.summary.data, searchQuery]);

  // Helper to render score badges
  const renderScoreCell = (score: number | undefined) => {
    if (score === undefined) return <span className="text-gray-300 dark:text-gray-700">-</span>;
    if (score === 1.0) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-[#134e4a] dark:text-[#a7f3d0]" title="1.0">
          1
        </span>
      );
    }
    if (score === 0.8) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-[#064e3b] dark:text-[#a7f3d0]" title="0.8">
          .8
        </span>
      );
    }
    if (score === 0.6) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 text-xs font-bold text-sky-800 dark:bg-[#0c4a6e] dark:text-[#bae6fd]" title="0.6">
          .6
        </span>
      );
    }
    if (score === 0.4) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-xs font-bold text-amber-800 dark:bg-[#78350f] dark:text-[#fef3c7]" title="0.4">
          .4
        </span>
      );
    }
    if (score === 0.0) {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-xs font-semibold text-rose-800 dark:bg-[#881337] dark:text-[#fecdd3]" title="0.0">
          0
        </span>
      );
    }
    // Any other generic score value
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-200" title={String(score)}>
        {score}
      </span>
    );
  };

  return (
    <section className="w-full px-4 py-6">
      <PageHeader
        title="Quản lý chấm công"
        description="Theo dõi lịch sử check-in/out hằng ngày và quản lý bảng công tổng hợp hàng tháng."
      />

      <Tabs defaultTab={isHRorAdmin ? 'system' : 'personal'}>
        <TabList>
          {isHRorAdmin && (
            <Tab id="system">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Bảng công hệ thống (HR/Admin)
              </span>
            </Tab>
          )}
          <Tab id="personal">
            <span className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Chấm công cá nhân
            </span>
          </Tab>
        </TabList>

        {/* ==================== TAB 1: BẢNG CÔNG HỆ THỐNG (Dành riêng cho HR/Admin) ==================== */}
        {isHRorAdmin && (
          <TabPanel id="system">
            <div className="space-y-6">
              {/* Cấu hình thời gian & Upload File */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Chọn thời gian */}
                <Card>
                  <CardBody className="space-y-4">
                    <h3 className="text-base font-semibold text-[#1b1b22] flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#1f108e]" />
                      Chọn kỳ chấm công
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        label="Tháng"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                          </option>
                        ))}
                      </SelectField>
                      <SelectField
                        label="Năm"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                      >
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                      </SelectField>
                    </div>
                  </CardBody>
                </Card>

                {/* Upload File chấm công */}
                <Card className="md:col-span-2">
                  <CardBody className="space-y-4">
                    <h3 className="text-base font-semibold text-[#1b1b22] flex items-center gap-2">
                      <Upload className="h-4 w-4 text-[#1f108e]" />
                      Upload file Excel chấm công
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Custom File Button */}
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#c8c4d5] bg-white px-4 h-10 text-sm font-semibold text-[#1b1b22] hover:bg-[#f6f2fc] transition-colors">
                        <Upload className="h-4 w-4 text-[#464553]" />
                        {file ? 'Chọn file khác' : 'Chọn file Excel (.xlsx)'}
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {file && (
                        <div className="flex items-center gap-2 rounded-lg bg-[#f0ecf6] px-3 h-10 text-sm font-semibold text-[#58566a]">
                          <FileSpreadsheet className="h-4 w-4 text-[#1f108e]" />
                          <span className="max-w-[200px] truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          disabled={!file}
                          loading={excelAttendance.calculate.isPending}
                          onClick={handleCalculate}
                          className="h-10"
                        >
                          Tính công & Lưu
                        </Button>
                        <Button
                          disabled={!file}
                          variant="outline"
                          loading={excelAttendance.calculateExport.isPending}
                          onClick={handleCalculateExport}
                          className="h-10"
                          icon={<FileDown className="h-4 w-4" />}
                        >
                          Tính & Xuất file
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-[#8a8898]">
                      Lưu ý: Tải file Excel gốc có chứa cột 'Mã nhân viên', 'Tên nhân viên', 'Phòng ban' và các cặp cột 'Vào' / 'Ra' của các ngày để hệ thống tự động tính điểm công.
                    </p>
                  </CardBody>
                </Card>
              </div>

              {/* Bảng công tổng hợp */}
              <Card>
                <CardHeader
                  title={`Bảng công tổng hợp hệ thống — Tháng ${selectedMonth}/${selectedYear}`}
                />
                <CardBody className="space-y-4">
                  {/* Tìm kiếm */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8898]" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm theo nhân viên, mã số, phòng ban..."
                      className="h-11 w-full rounded-lg border border-[#c8c4d5] bg-white pl-10 pr-4 text-sm text-[#1b1b22] outline-none placeholder:text-[#8a8898] focus:border-[#1f108e] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] transition-all"
                    />
                  </div>

                  {/* Grid Table */}
                  <div className="min-w-0 w-full">
                    <div className="overflow-auto max-h-[560px] rounded-xl border border-[#c8c4d5] bg-white">
                      <table className="w-full min-w-[1200px] table-fixed border-collapse text-left text-sm text-[#1b1b22]">
                        <thead className="sticky top-0 z-20">
                          <tr className="border-b border-[#c8c4d5] bg-[#f6f2fc] text-xs font-bold uppercase tracking-wider text-[#464553]">
                            <th className="w-[180px] px-4 py-3 sticky left-0 z-10 bg-[#f6f2fc] border-r border-[#c8c4d5]">
                              Nhân viên
                            </th>
                            <th className="w-[140px] px-4 py-3 border-r border-[#c8c4d5]">Phòng ban</th>
                            <th className="w-[80px] px-4 py-3 text-center border-r border-[#c8c4d5] bg-[#f0eafc]">
                              Tổng công
                            </th>
                            {dayKeys.map((day) => (
                              <th key={day} className="w-[45px] text-center px-1 py-3 text-[10px]">
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e4e1eb]">
                          {excelAttendance.summary.isLoading && (
                            <tr>
                              <td colSpan={3 + dayKeys.length} className="py-8 text-center text-[#8a8898]">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1f108e] border-t-transparent" />
                                  Đang tải dữ liệu chấm công...
                                </div>
                              </td>
                            </tr>
                          )}

                          {!excelAttendance.summary.isLoading && filteredSummary.length === 0 && (
                            <tr>
                              <td colSpan={3 + dayKeys.length} className="py-8 text-center text-[#8a8898]">
                                Không tìm thấy dữ liệu chấm công. Vui lòng upload file Excel của tháng để tính công.
                              </td>
                            </tr>
                          )}

                          {!excelAttendance.summary.isLoading &&
                            filteredSummary.map((row) => (
                              <tr key={row.employeeId} className="hover:bg-[#fcfaff] transition-colors">
                                {/* Name column stickied */}
                                <td className="px-4 py-3 sticky left-0 z-10 bg-white font-semibold text-[#1b1b22] border-r border-[#c8c4d5] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                  <div>
                                    <p className="truncate font-medium">{row.employeeName}</p>
                                    <span className="inline-flex rounded bg-[#f0ecf6] px-1 text-[9px] font-bold text-[#58566a]">
                                      {row.employeeId}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 border-r border-[#c8c4d5] text-xs text-[#58566a] truncate">
                                  {row.department}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-[#c8c4d5] font-bold text-[#1f108e] bg-[#fdfcff]">
                                  {row.totalScore.toFixed(1)}
                                </td>
                                {dayKeys.map((day) => (
                                  <td key={day} className="px-1 py-3 text-center">
                                    {renderScoreCell(row.dailyScores[day])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Chú thích điểm công */}
                  <div className="flex flex-wrap items-center gap-6 rounded-lg bg-[#f6f2fc] dark:bg-[#1a1826] p-3 text-xs text-[#58566a] dark:text-[#9490a8]">
                    <span className="font-semibold text-[#1b1b22] dark:text-[#e8e4f0]">Chú thích điểm công:</span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-[#134e4a] dark:text-[#a7f3d0]">
                        1
                      </span>
                      Đủ công (1.0)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-[#064e3b] dark:text-[#a7f3d0]">
                        .8
                      </span>
                      Điểm cũ (0.8)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-sky-100 text-[10px] font-bold text-sky-800 dark:bg-[#0c4a6e] dark:text-[#bae6fd]">
                        .6
                      </span>
                      Nửa công chiều (0.6)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-[10px] font-bold text-amber-800 dark:bg-[#78350f] dark:text-[#fef3c7]">
                        .4
                      </span>
                      Nửa công sáng (0.4)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-rose-100 text-[10px] font-bold text-rose-800 dark:bg-[#881337] dark:text-[#fecdd3]">
                        0
                      </span>
                      Nghỉ / Không đủ điều kiện (0.0)
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </TabPanel>
        )}

        {/* ==================== TAB 2: CHẤM CÔNG CÁ NHÂN ==================== */}
        <TabPanel id="personal">
          <div className="space-y-6">
            {/* Panel Check-in/out hằng ngày */}
            {user?.employeeId ? (
              <AttendancePanel employeeId={user.employeeId} />
            ) : (
              <Card>
                <CardBody className="flex items-center gap-3 text-amber-600 bg-amber-50 rounded-lg p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-semibold">
                    Tài khoản của bạn chưa được liên kết với hồ sơ nhân sự (employeeId). Vui lòng liên hệ bộ phận HR để cấu hình.
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Bảng công tổng hợp cá nhân (Tính từ Excel) */}
            {user?.employeeId && (
              <Card>
                <CardHeader
                  title={`Bảng điểm công tổng hợp cá nhân — Tháng ${personalMonth}/${personalYear}`}
                  description="Bảng điểm công tính toán tự động từ file dữ liệu Excel của phòng nhân sự."
                />
                <CardBody className="space-y-4">
                  {personalExcelSummary.isLoading && (
                    <div className="flex items-center justify-center py-6 text-[#8a8898]">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1f108e] border-t-transparent mr-2" />
                      Đang tải bảng điểm công...
                    </div>
                  )}

                  {!personalExcelSummary.isLoading && !personalExcelSummary.data && (
                    <div className="py-4 text-center text-xs text-[#8a8898]">
                      Chưa có dữ liệu tổng hợp tính công từ Excel cho tháng này.
                    </div>
                  )}

                  {!personalExcelSummary.isLoading && personalExcelSummary.data && (
                    <div className="space-y-4">
                      <div className="min-w-0 w-full">
                        <div className="overflow-auto max-h-[300px] rounded-xl border border-[#c8c4d5] bg-white">
                          <table className="w-full min-w-[1200px] table-fixed border-collapse text-left text-sm text-[#1b1b22]">
                            <thead className="sticky top-0 z-20">
                              <tr className="border-b border-[#c8c4d5] bg-[#f6f2fc] text-xs font-bold uppercase tracking-wider text-[#464553]">
                                <th className="w-[180px] px-4 py-3 sticky left-0 z-10 bg-[#f6f2fc] border-r border-[#c8c4d5]">
                                  Nhân viên
                                </th>
                                <th className="w-[140px] px-4 py-3 border-r border-[#c8c4d5]">Phòng ban</th>
                                <th className="w-[80px] px-4 py-3 text-center border-r border-[#c8c4d5] bg-[#f0eafc]">
                                  Tổng công
                                </th>
                                {Array.from(
                                  { length: new Date(personalYear, personalMonth, 0).getDate() },
                                  (_, i) => String(i + 1)
                                ).map((day) => (
                                  <th key={day} className="w-[45px] text-center px-1 py-3 text-[10px]">
                                    {day}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e4e1eb]">
                              <tr className="hover:bg-[#fcfaff] transition-colors">
                                <td className="px-4 py-3 sticky left-0 z-10 bg-white font-semibold text-[#1b1b22] border-r border-[#c8c4d5] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                  <div>
                                    <p className="truncate font-medium">{personalExcelSummary.data.employeeName}</p>
                                    <span className="inline-flex rounded bg-[#f0ecf6] px-1 text-[9px] font-bold text-[#58566a]">
                                      {personalExcelSummary.data.employeeId}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 border-r border-[#c8c4d5] text-xs text-[#58566a] truncate">
                                  {personalExcelSummary.data.department}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-[#c8c4d5] font-bold text-[#1f108e] bg-[#fdfcff]">
                                  {personalExcelSummary.data.totalScore.toFixed(1)}
                                </td>
                                {Array.from(
                                  { length: new Date(personalYear, personalMonth, 0).getDate() },
                                  (_, i) => String(i + 1)
                                ).map((day) => (
                                  <td key={day} className="px-1 py-3 text-center">
                                    {renderScoreCell(personalExcelSummary.data.dailyScores[day])}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Chú thích điểm công */}
                      <div className="flex flex-wrap items-center gap-6 rounded-lg bg-[#f6f2fc] dark:bg-[#1a1826] p-3 text-xs text-[#58566a] dark:text-[#9490a8]">
                        <span className="font-semibold text-[#1b1b22] dark:text-[#e8e4f0]">Chú thích điểm công:</span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-[#134e4a] dark:text-[#a7f3d0]">
                            1
                          </span>
                          Đủ công (1.0)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-[#064e3b] dark:text-[#a7f3d0]">
                            .8
                          </span>
                          Điểm cũ (0.8)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-sky-100 text-[10px] font-bold text-sky-800 dark:bg-[#0c4a6e] dark:text-[#bae6fd]">
                            .6
                          </span>
                          Nửa công chiều (0.6)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-[10px] font-bold text-amber-800 dark:bg-[#78350f] dark:text-[#fef3c7]">
                            .4
                          </span>
                          Nửa công sáng (0.4)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-rose-100 text-[10px] font-bold text-rose-800 dark:bg-[#881337] dark:text-[#fecdd3]">
                            0
                          </span>
                          Nghỉ / Không đủ điều kiện (0.0)
                        </span>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Bảng nhật ký log tháng này */}
            {user?.employeeId && (
              <Card>
                <CardHeader
                  title="Nhật ký chấm công cá nhân"
                  action={
                    <div className="flex items-center gap-2">
                      <SelectField
                        label="Tháng"
                        value={personalMonth}
                        className="h-9 min-w-32 py-1 text-xs"
                        onChange={(e) => setPersonalMonth(Number(e.target.value))}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                          </option>
                        ))}
                      </SelectField>
                      <SelectField
                        label="Năm"
                        value={personalYear}
                        className="h-9 min-w-24 py-1 text-xs"
                        onChange={(e) => setPersonalYear(Number(e.target.value))}
                      >
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                      </SelectField>
                    </div>
                  }
                />
                <CardBody>
                  <DataTable
                    data={personalAttendance.month.data || []}
                    keyField="id"
                    emptyText="Không có dữ liệu chấm công cho tháng này"
                    columns={[
                      {
                        header: 'Ngày làm việc',
                        accessor: (row) => (
                          <span className="font-semibold text-[#1b1b22]">
                            {new Date(row.work_date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </span>
                        ),
                      },
                      {
                        header: 'Giờ vào (Check-in)',
                        accessor: (row) =>
                          row.check_in ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {row.check_in}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-medium">Chưa check-in</span>
                          ),
                      },
                      {
                        header: 'Giờ ra (Check-out)',
                        accessor: (row) =>
                          row.check_out ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {row.check_out}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-medium">Chưa check-out</span>
                          ),
                      },
                      {
                        header: 'Làm thêm (OT)',
                        accessor: (row) =>
                          row.ot_hours ? (
                            <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">
                              +{row.ot_hours} giờ
                            </span>
                          ) : (
                            '-'
                          ),
                      },
                      {
                        header: 'Ghi chú',
                        accessor: (row) => (
                          <span className="text-xs text-[#58566a] italic max-w-xs truncate block" title={row.note || ''}>
                            {row.note || '-'}
                          </span>
                        ),
                      },
                      {
                        header: 'Trạng thái',
                        accessor: (row) => (
                          <span className="inline-flex items-center rounded-xl bg-[#f0ecf6] px-2.5 py-1 text-xs font-bold text-[#58566a]">
                            {row.status || 'OK'}
                          </span>
                        ),
                      },
                    ]}
                  />
                </CardBody>
              </Card>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </section>
  );
}
