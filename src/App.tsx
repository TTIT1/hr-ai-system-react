import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const EmployeePage = lazy(() => import('./pages/EmployeePage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const LeavePage = lazy(() => import('./pages/LeavePage'));
const SalaryPage = lazy(() => import('./pages/SalaryPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const RecruitmentPage = lazy(() => import('./pages/RecruitmentPage'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const DepartmentPage = lazy(() => import('./pages/DepartmentPage'));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const OvertimePage = lazy(() => import('./pages/OvertimePage'));
const AttendanceExplanationPage = lazy(() => import('./pages/AttendanceExplanationPage'));
const HolidayPage = lazy(() => import('./pages/HolidayPage'));
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const CompanyConfigPage = lazy(() => import('./pages/CompanyConfigPage'));
const UserRolePage = lazy(() => import('./pages/UserRolePage'));

function PageFallback() {
  return <div className="p-6 text-sm text-muted">Loading...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route element={<ProtectedRoute permission="employeeView" />}>
              <Route path="employees" element={<EmployeePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="departmentView" />}>
              <Route path="departments" element={<DepartmentPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="companyConfigView" />}>
              <Route path="company-configs" element={<CompanyConfigPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="projectView" />}>
              <Route path="projects" element={<ProjectsPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="attendancePersonal" />}>
              <Route path="attendance" element={<AttendancePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="attendanceExplanationMine" />}>
              <Route path="attendance-explanations" element={<AttendanceExplanationPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="leavePersonal" />}>
              <Route path="leave" element={<LeavePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="overtimePersonal" />}>
              <Route path="overtime" element={<OvertimePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="holidayView" />}>
              <Route path="holidays" element={<HolidayPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="notificationMine" />}>
              <Route path="notifications" element={<NotificationPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="payroll" />}>
              <Route path="salary" element={<SalaryPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="userRoleManage" />}>
              <Route path="user-roles" element={<UserRolePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="kpiView" />}>
              <Route path="performance" element={<PerformancePage />} />
            </Route>
            <Route element={<ProtectedRoute permission="jobView" />}>
              <Route path="recruitment" element={<RecruitmentPage />} />
            </Route>
            <Route element={<ProtectedRoute permission="chatbot" />}>
              <Route path="chatbot" element={<ChatbotPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
