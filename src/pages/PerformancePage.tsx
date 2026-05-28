import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiForm } from '../components/performance/KpiForm';
import { useAuth } from '../hooks/useAuth';
import { usePerformance, usePerformanceActions } from '../hooks/usePerformance';
import { canAccess } from '../auth/permissions';
import { useTranslation } from '../context/LanguageContext';

export default function PerformancePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canCreateKpi = canAccess(user?.role, 'kpiCreate');
  const canViewTeamPerformance = canAccess(user?.role, 'performanceTeam');
  const canAnalyzeAll = canAccess(user?.role, 'performanceAllAnalyze');
  const performance = usePerformance(user?.employeeId, canViewTeamPerformance);
  const actions = usePerformanceActions();

  return (
    <section className="w-full">
      <PageHeader title={t('performance.title')} description={t('performance.subtitle')} />
      {canCreateKpi && (
        <Card>
          <CardHeader title={t('performance.newKpi')} />
          <CardBody><KpiForm employeeId={user?.employeeId} onSubmit={(payload) => actions.createKpi.mutate(payload)} loading={actions.createKpi.isPending} /></CardBody>
        </Card>
      )}
      <Card className="mt-5">
        <CardHeader
          title={t('performance.kpiRecords')}
          action={
            canViewTeamPerformance ? (
              <Button onClick={() => user?.employeeId && actions.analyze.mutate(user.employeeId)} loading={actions.analyze.isPending}>{t('performance.analyzeMine')}</Button>
            ) : undefined
          }
        />
        <CardBody>
          <DataTable data={performance.kpis.data || []} keyField="id" columns={[
            { header: t('performance.week'), accessor: 'weekStart' },
            { header: t('performance.score'), accessor: 'kpiScore' },
            { header: t('performance.tasks'), accessor: (row) => `${row.tasksDone || 0}/${row.tasksTotal || 0}` },
            { header: t('performance.hours'), accessor: 'workHours' },
            { header: t('performance.late'), accessor: 'lateDays' },
          ]} />
        </CardBody>
      </Card>
      {canViewTeamPerformance && (
        <Card className="mt-5">
          <CardHeader
            title={t('performance.analysisDashboard')}
            action={
              canAnalyzeAll ? (
                <Button variant="secondary" onClick={() => actions.analyzeAll.mutate()} loading={actions.analyzeAll.isPending}>{t('performance.analyzeAll')}</Button>
              ) : undefined
            }
          />
          <CardBody>
            <DataTable data={performance.dashboard.data || []} keyField="id" columns={[
              { header: t('performance.employee'), accessor: (row) => row.employee?.fullName || row.employee?.id || '-' },
              { header: t('performance.trend'), accessor: 'trend' },
              { header: t('performance.changePct'), accessor: 'kpiChangePct' },
              { header: t('performance.alert'), accessor: (row) => <StatusBadge status={row.alert ? row.alertLevel || 'ALERT' : 'OK'} /> },
              { header: t('performance.message'), accessor: 'alertMessage' },
            ]} />
          </CardBody>
        </Card>
      )}
    </section>
  );
}
