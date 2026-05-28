import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiForm } from '../components/performance/KpiForm';
import { useAuth } from '../hooks/useAuth';
import { usePerformance, usePerformanceActions } from '../hooks/usePerformance';

export default function PerformancePage() {
  const { user } = useAuth();
  const performance = usePerformance(user?.employeeId);
  const actions = usePerformanceActions();

  return (
    <section className="w-full">
      <PageHeader title="Performance" description="Track weekly KPI records and AI-assisted trend analysis." />
      <Card>
        <CardHeader title="New KPI" />
        <CardBody><KpiForm employeeId={user?.employeeId} onSubmit={(payload) => actions.createKpi.mutate(payload)} loading={actions.createKpi.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="KPI records" action={<Button onClick={() => user?.employeeId && actions.analyze.mutate(user.employeeId)} loading={actions.analyze.isPending}>Analyze mine</Button>} />
        <CardBody>
          <DataTable data={performance.kpis.data || []} keyField="id" columns={[
            { header: 'Week', accessor: 'weekStart' },
            { header: 'Score', accessor: 'kpiScore' },
            { header: 'Tasks', accessor: (row) => `${row.tasksDone || 0}/${row.tasksTotal || 0}` },
            { header: 'Hours', accessor: 'workHours' },
            { header: 'Late', accessor: 'lateDays' },
          ]} />
        </CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Analysis dashboard" action={<Button variant="secondary" onClick={() => actions.analyzeAll.mutate()} loading={actions.analyzeAll.isPending}>Analyze all</Button>} />
        <CardBody>
          <DataTable data={performance.dashboard.data || []} keyField="id" columns={[
            { header: 'Employee', accessor: (row) => row.employee?.fullName || row.employee?.id || '-' },
            { header: 'Trend', accessor: 'trend' },
            { header: 'Change %', accessor: 'kpiChangePct' },
            { header: 'Alert', accessor: (row) => <StatusBadge status={row.alert ? row.alertLevel || 'ALERT' : 'OK'} /> },
            { header: 'Message', accessor: 'alertMessage' },
          ]} />
        </CardBody>
      </Card>
    </section>
  );
}
