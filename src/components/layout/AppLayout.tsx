import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Building2,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  Mail,
  Moon,
  Search,
  Sun,
  UserPlus,
  Users,
  Bot,
  Calendar,
  CreditCard,
  Globe,
  FileText,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { canAccess, type Permission } from '../../auth/permissions';

const primaryLinks = [
  { to: '/', label: 'Dashboard', key: 'sidebar.dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employee Directory', key: 'sidebar.employees', icon: Users, permission: 'employeeView' },
  { to: '/departments', label: 'Departments', key: 'sidebar.departments', icon: Building2, permission: 'departmentView' },
  { to: '/company-configs', label: 'Company Configs', key: 'sidebar.companyConfigs', icon: Settings, permission: 'companyConfigView' },
  { to: '/projects', label: 'Projects', key: 'sidebar.projects', icon: FileText, permission: 'projectView' },
  { to: '/recruitment', label: 'Onboarding', key: 'sidebar.onboarding', icon: UserPlus, permission: 'jobView' },
  { to: '/attendance', label: 'Attendance', key: 'sidebar.attendance', icon: Clock3, permission: 'attendancePersonal' },
  { to: '/attendance-explanations', label: 'Explanations', key: 'sidebar.explanations', icon: FileText, permission: 'attendanceExplanationMine' },
  { to: '/leave', label: 'Leave Requests', key: 'sidebar.leave', icon: Calendar, permission: 'leavePersonal' },
  { to: '/overtime', label: 'Overtime', key: 'sidebar.overtime', icon: Clock3, permission: 'overtimePersonal' },
  { to: '/holidays', label: 'Holidays', key: 'sidebar.holidays', icon: Calendar, permission: 'holidayView' },
  { to: '/notifications', label: 'Notifications', key: 'sidebar.notifications', icon: Bell, permission: 'notificationMine' },
  { to: '/salary', label: 'Payroll & Salary', key: 'sidebar.payroll', icon: CreditCard, permission: 'payroll' },
  { to: '/user-roles', label: 'User Roles', key: 'sidebar.userRoles', icon: ShieldCheck, permission: 'userRoleManage' },
  { to: '/performance', label: 'Reports', key: 'sidebar.reports', icon: BarChart3, permission: 'kpiView' },
  { to: '/chatbot', label: 'ChatBox AI', key: 'sidebar.chatbot', icon: Bot, permission: 'chatbot' },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const { state, dispatch } = useAppContext();
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.fullName || user?.email || 'Alex Rivera';
  const role = user?.role;
  const roleLabel = role || 'No role';
  const collapsed = !state.sidebarOpen;
  const visibleLinks = primaryLinks.filter((link) => !link.permission || canAccess(role, link.permission as Permission));

  return (
    <div className="flex h-screen overflow-hidden bg-[#fcf8ff] dark:bg-[#0f0e17] text-[#1b1b22] dark:text-[#e8e4f0]">
      {/* ===================== SIDEBAR ===================== */}
      <aside
        style={{ width: collapsed ? '68px' : '256px' }}
        className="hidden h-screen shrink-0 flex-col border-r border-[#c8c4d5] dark:border-[#2e2a3d] bg-[#f6f2fc] dark:bg-[#1a1826] lg:flex overflow-hidden transition-[width] duration-300 ease-in-out"
      >
        {/* Branding */}
        <div
          className={`flex items-center border-b border-[#c8c4d5] dark:border-[#2e2a3d] ${
            collapsed ? 'justify-center px-2 py-5' : 'px-6 py-6'
          }`}
        >
          {collapsed ? (
            <span className="text-lg font-black text-[#1f108e] dark:text-[#a78bfa]">HR</span>
          ) : (
            <div className="min-w-0">
              <p className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1f108e] dark:text-[#a78bfa]">
                {t('sidebar.portal')}
              </p>
              <p className="mt-0.5 text-sm text-[#464553] dark:text-[#8b87a0]">{t('sidebar.enterprise')}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const translatedLabel = t(link.key);
            const label = translatedLabel === link.key ? link.label : translatedLabel;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-[rgba(55,48,163,0.12)] dark:bg-[rgba(167,139,250,0.15)] font-bold text-[#1f108e] dark:text-[#a78bfa]'
                      : 'font-normal text-[#464553] dark:text-[#9490a8] hover:bg-[#ede8f7] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#c4b5fd]'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#c8c4d5] dark:border-[#2e2a3d] px-2 py-3 space-y-1">
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            title={collapsed ? t('common.logout') : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#464553] dark:text-[#9490a8] transition hover:bg-[#ede8f7] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#c4b5fd] ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <CircleUserRound className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t('common.logout')}</span>}
          </button>

          {collapsed ? (
            <div
              title={`${displayName} (${roleLabel})`}
              className="flex justify-center py-1"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e4e1eb] dark:bg-[#2e2a3d] text-xs font-bold text-[#464553] dark:text-[#c4b5fd]">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e4e1eb] dark:bg-[#2e2a3d] text-xs font-bold text-[#464553] dark:text-[#c4b5fd]">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#1b1b22] dark:text-[#e8e4f0]">{displayName}</p>
                <p className="truncate text-xs text-[#464553] dark:text-[#8b87a0]">{roleLabel}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ===================== RIGHT COLUMN ===================== */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#13111f] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Toggle Sidebar */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] text-[#464553] dark:text-[#9490a8] transition hover:bg-[#ede8f7] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#c4b5fd]"
              aria-label="Toggle sidebar"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor" />
                <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
                <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
              </svg>
            </button>

            <p className="text-[22px] font-bold text-[#1b1b22] dark:text-[#e8e4f0]">HumanResources</p>

            <div className="hidden w-[300px] items-center rounded-xl bg-[#f0ecf6] dark:bg-[#1e1c2e] px-4 py-2 md:flex">
              <Search className="h-4 w-4 shrink-0 text-[#464553] dark:text-[#6b6880]" />
              <input
                readOnly
                value={t('common.search')}
                className="w-full bg-transparent px-3 text-sm text-[#464553] dark:text-[#9490a8] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#464553] dark:text-[#9490a8]">
            {/* 🌙 Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] transition hover:bg-[#ede8f7] dark:hover:bg-[#252235] hover:text-[#1f108e] dark:hover:text-[#c4b5fd]"
              aria-label="Toggle dark mode"
              title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-xl border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1e1c2e] px-3 py-1.5 text-xs font-bold text-[#464553] dark:text-[#9490a8] transition hover:bg-[#ede8f7] dark:hover:bg-[#252235]">
                <Globe className="h-4 w-4 text-[#1f108e] dark:text-[#a78bfa]" />
                <span className="tracking-wider">
                  {language === 'en' ? 'EN' : language === 'vi' ? 'VI' : 'ZH'}
                </span>
              </button>
              <div className="absolute right-0 top-full z-[9999] mt-1 hidden w-36 rounded-xl border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1e1c2e] p-1.5 shadow-lg group-hover:block hover:block">
                {[
                  { code: 'en', flag: '🇬🇧', label: 'English' },
                  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
                  { code: 'zh', flag: '🇨🇳', label: '中文 (简体)' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'en' | 'vi' | 'zh')}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                      language === lang.code
                        ? 'bg-[rgba(55,48,163,0.1)] dark:bg-[rgba(167,139,250,0.15)] text-[#1f108e] dark:text-[#a78bfa]'
                        : 'text-[#464553] dark:text-[#9490a8] hover:bg-[#ede8f7] dark:hover:bg-[#252235]'
                    }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <Bell className="h-5 w-5 cursor-pointer transition hover:text-[#1f108e] dark:hover:text-[#c4b5fd]" />
            <Mail className="h-5 w-5 cursor-pointer transition hover:text-[#1f108e] dark:hover:text-[#c4b5fd]" />
            <CircleUserRound className="h-5 w-5 cursor-pointer transition hover:text-[#1f108e] dark:hover:text-[#c4b5fd]" />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#fcf8ff] dark:bg-[#0f0e17] p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
