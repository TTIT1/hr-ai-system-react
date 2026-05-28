import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { LeaveTable } from '../components/leave/LeaveTable';
import { useAuth } from '../hooks/useAuth';
import { useLeave, useLeaveActions } from '../hooks/useLeave';

export default function LeavePage() {
  const { user } = useAuth();
  const leave = useLeave(user?.employeeId);
  const actions = useLeaveActions(user?.employeeId);

  return (
    <section className="w-full">
      <PageHeader title="Leave" description="Submit leave requests and review approvals." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">Total</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.totalDays ?? '-'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">Used</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.usedDays ?? '-'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">Remaining</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.remainingDays ?? '-'}</p></CardBody></Card>
      </div>
      <Card className="mt-5">
        <CardHeader title="New leave request" />
        <CardBody><LeaveRequestForm onSubmit={(payload) => actions.request.mutate(payload)} loading={actions.request.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="My leave requests" />
        <CardBody><LeaveTable requests={leave.mine.data || []} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="HR approvals" />
        <CardBody><LeaveTable requests={leave.all.data || []} onApprove={(id, ok) => actions.approve.mutate({ id, ok })} /></CardBody>
      </Card>
    </section>
  );
}
