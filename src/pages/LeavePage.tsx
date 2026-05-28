import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { LeaveTable } from '../components/leave/LeaveTable';
import { useAuth } from '../hooks/useAuth';
import { useLeave, useLeaveActions } from '../hooks/useLeave';
import { canAccess } from '../auth/permissions';
import { useTranslation } from '../context/LanguageContext';

export default function LeavePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canManageLeave = canAccess(user?.role, 'leaveManage');
  const leave = useLeave(user?.employeeId, undefined, canManageLeave);
  const actions = useLeaveActions(user?.employeeId);

  return (
    <section className="w-full">
      <PageHeader title={t('leave.title')} description={t('leave.subtitle')} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">{t('leave.total')}</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.totalDays ?? '-'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">{t('leave.used')}</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.usedDays ?? '-'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">{t('leave.remaining')}</p><p className="text-3xl font-semibold text-[#1b1b22]">{leave.balance.data?.remainingDays ?? '-'}</p></CardBody></Card>
      </div>
      <Card className="mt-5">
        <CardHeader title={t('leave.newRequest')} />
        <CardBody><LeaveRequestForm onSubmit={(payload) => actions.request.mutate(payload)} loading={actions.request.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title={t('leave.myRequests')} />
        <CardBody><LeaveTable requests={leave.mine.data || []} /></CardBody>
      </Card>
      {canManageLeave && (
        <Card className="mt-5">
          <CardHeader title={t('leave.hrApprovals')} />
          <CardBody><LeaveTable requests={leave.all.data || []} onApprove={(id, ok) => actions.approve.mutate({ id, ok })} /></CardBody>
        </Card>
      )}
    </section>
  );
}
