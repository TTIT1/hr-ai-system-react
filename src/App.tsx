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

function PageFallback() {
  return <div className="p-6 text-sm text-muted">Loading...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeePage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="salary" element={<SalaryPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="recruitment" element={<RecruitmentPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
