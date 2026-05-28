import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { CvUploadForm } from '../components/recruitment/CvUploadForm';
import { JobForm } from '../components/recruitment/JobForm';
import { useDepartments } from '../hooks/useEmployee';
import { useRecruitment, useRecruitmentActions } from '../hooks/useRecruitment';

export default function RecruitmentPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const departments = useDepartments();
  const recruitment = useRecruitment(selectedJobId);
  const actions = useRecruitmentActions();

  return (
    <section className="w-full">
      <PageHeader title="Recruitment" description="Create jobs, upload CVs, and manage AI-assisted candidate pipeline." />
      <Card>
        <CardHeader title="Create job" />
        <CardBody><JobForm departments={departments.data || []} onSubmit={(payload) => actions.createJob.mutate(payload)} loading={actions.createJob.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Open jobs" />
        <CardBody>
          <DataTable data={recruitment.jobs.data || []} keyField="id" columns={[
            { header: 'Title', accessor: 'title' },
            { header: 'Department', accessor: (row) => row.department?.name || '-' },
            { header: 'Deadline', accessor: 'deadline' },
            { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
            { header: 'Actions', accessor: (row) => <div className="flex gap-2"><Button className="h-8" variant="secondary" onClick={() => setSelectedJobId(row.id)}>Pipeline</Button><Button className="h-8" variant="danger" onClick={() => actions.closeJob.mutate(row.id)}>Close</Button></div> },
          ]} />
        </CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Upload CV" />
        <CardBody><CvUploadForm jobId={selectedJobId} onSubmit={(file, params) => actions.uploadCv.mutate({ file, params })} loading={actions.uploadCv.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Pipeline" />
        <CardBody>
          <DataTable data={recruitment.pipeline.data || []} keyField="id" columns={[
            { header: 'Candidate', accessor: (row) => <div><p>{row.candidateName || '-'}</p><p className="text-xs text-muted">{row.candidateEmail}</p></div> },
            { header: 'Score', accessor: 'aiMatchScore' },
            { header: 'Stage', accessor: (row) => <StatusBadge status={row.pipelineStage} /> },
            { header: 'Status', accessor: 'status' },
            { header: 'Actions', accessor: (row) => <div className="flex gap-2"><Button className="h-8" variant="secondary" onClick={() => actions.updateStage.mutate({ id: row.id, stage: 'INTERVIEW' })}>Interview</Button><Button className="h-8" variant="secondary" onClick={() => actions.updateStage.mutate({ id: row.id, stage: 'HIRED' })}>Hire</Button></div> },
          ]} />
        </CardBody>
      </Card>
    </section>
  );
}
