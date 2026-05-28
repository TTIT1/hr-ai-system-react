import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { CvUploadForm } from '../components/recruitment/CvUploadForm';
import { JobForm } from '../components/recruitment/JobForm';
import { useDepartments } from '../hooks/useEmployee';
import { useAuth } from '../hooks/useAuth';
import { useRecruitment, useRecruitmentActions } from '../hooks/useRecruitment';
import { canAccess } from '../auth/permissions';
import { useTranslation } from '../context/LanguageContext';

export default function RecruitmentPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const canManageJobs = canAccess(user?.role, 'jobManage');
  const canUploadCv = canAccess(user?.role, 'cvUpload');
  const canManagePipeline = canAccess(user?.role, 'cvPipelineManage');
  const departments = useDepartments();
  const recruitment = useRecruitment(selectedJobId, canManagePipeline);
  const actions = useRecruitmentActions();

  return (
    <section className="w-full">
      <PageHeader title={t('recruitment.title')} description={t('recruitment.subtitle')} />
      {canManageJobs && (
        <Card>
          <CardHeader title={t('recruitment.createJob')} />
          <CardBody><JobForm departments={departments.data || []} onSubmit={(payload) => actions.createJob.mutate(payload)} loading={actions.createJob.isPending} /></CardBody>
        </Card>
      )}
      <Card className="mt-5">
        <CardHeader title={t('recruitment.openJobs')} />
        <CardBody>
          <DataTable data={recruitment.jobs.data || []} keyField="id" columns={[
            { header: t('recruitment.titleColumn'), accessor: 'title' },
            { header: t('recruitment.department'), accessor: (row) => row.department?.name || '-' },
            { header: t('recruitment.deadline'), accessor: 'deadline' },
            { header: t('recruitment.status'), accessor: (row) => <StatusBadge status={row.status} /> },
            {
              header: t('common.actions'),
              accessor: (row) => (
                <div className="flex gap-2">
                  {canUploadCv && <Button className="h-8" variant="secondary" onClick={() => setSelectedJobId(row.id)}>{t('recruitment.select')}</Button>}
                  {canManagePipeline && <Button className="h-8" variant="secondary" onClick={() => setSelectedJobId(row.id)}>{t('recruitment.pipeline')}</Button>}
                  {canManageJobs && <Button className="h-8" variant="danger" onClick={() => actions.closeJob.mutate(row.id)}>{t('recruitment.close')}</Button>}
                </div>
              ),
            },
          ]} />
        </CardBody>
      </Card>
      {canUploadCv && (
        <Card className="mt-5">
          <CardHeader title={t('recruitment.uploadCv')} />
          <CardBody><CvUploadForm jobId={selectedJobId} onSubmit={(file, params) => actions.uploadCv.mutate({ file, params })} loading={actions.uploadCv.isPending} /></CardBody>
        </Card>
      )}
      {canManagePipeline && (
        <Card className="mt-5">
          <CardHeader title={t('recruitment.pipeline')} />
          <CardBody>
            <DataTable data={recruitment.pipeline.data || []} keyField="id" columns={[
              { header: t('recruitment.candidate'), accessor: (row) => <div><p>{row.candidateName || '-'}</p><p className="text-xs text-muted">{row.candidateEmail}</p></div> },
              { header: t('recruitment.score'), accessor: 'aiMatchScore' },
              { header: t('recruitment.stage'), accessor: (row) => <StatusBadge status={row.pipelineStage} /> },
              { header: t('recruitment.status'), accessor: 'status' },
              { header: t('common.actions'), accessor: (row) => <div className="flex gap-2"><Button className="h-8" variant="secondary" onClick={() => actions.updateStage.mutate({ id: row.id, stage: 'INTERVIEW' })}>{t('recruitment.interview')}</Button><Button className="h-8" variant="secondary" onClick={() => actions.updateStage.mutate({ id: row.id, stage: 'HIRED' })}>{t('recruitment.hire')}</Button></div> },
            ]} />
          </CardBody>
        </Card>
      )}
    </section>
  );
}
