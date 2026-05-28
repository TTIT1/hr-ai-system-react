import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Activity,
  CalendarCheck,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader, StatCard } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { useLeave } from '../hooks/useLeave';
import { useSalary } from '../hooks/useSalary';
import { useAttendance } from '../hooks/useAttendance';
import { usePerformance } from '../hooks/usePerformance';
import { useTranslation } from '../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#c8c4d5] bg-white px-3 py-2">
      <p className="text-xs text-[#58566a]">{label}</p>
      <p className="text-sm font-semibold text-[#1b1b22]">{payload[0].value}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const employeeId = user?.employeeId;
  const leave = useLeave(employeeId);
  const salary = useSalary(employeeId);
  const attendance = useAttendance(employeeId);
  const performance = usePerformance(employeeId);

  const kpiData =
    performance.kpis.data
      ?.slice(0, 8)
      .reverse()
      .map((item) => ({ week: item.weekStart?.slice(5), score: item.kpiScore || 0 })) || [];

  const formatSalary = (val: number) =>
    new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(val);

  const displayName = user?.fullName?.split(' ').slice(-1)[0] || 'there';

  return (
    <div>
      <PageHeader
        title={t('login.welcome').replace('!', '') + `, ${displayName}`}
        description={t('dashboard.subtitle')}
      />

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard
            label={t('leave.remaining')}
            value={leave.balance.data?.remainingDays ?? '—'}
            icon={<CalendarCheck className="h-5 w-5" />}
            trend={t('dashboard.leaveTrend')}
            variant="blue"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            label={t('dashboard.actualDays')}
            value={attendance.summary.data?.actualDays ?? '—'}
            icon={<Activity className="h-5 w-5" />}
            trend={t('dashboard.attendanceTrend')}
            variant="emerald"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            label={t('dashboard.netSalary')}
            value={
              salary.latest.data?.netSalary
                ? formatSalary(salary.latest.data.netSalary)
                : '—'
            }
            icon={<WalletCards className="h-5 w-5" />}
            trend={t('dashboard.salaryTrend')}
            variant="purple"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard
            label={t('dashboard.latestKpi')}
            value={kpiData[kpiData.length - 1]?.score ?? '—'}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={t('dashboard.performanceTrend')}
            variant="amber"
          />
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* KPI Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader title={t('dashboard.kpiTrend')} />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpiData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,196,213,0.45)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#58566a' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#58566a' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#kpiGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Weekly bar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader title={t('dashboard.weeklyBreakdown')} />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,196,213,0.45)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#58566a' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#58566a' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="score"
                      fill="url(#barGrad)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
