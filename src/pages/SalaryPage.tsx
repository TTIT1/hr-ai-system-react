import { useState } from 'react';
import { Download } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TextField } from '../components/common/FormField';
import { SalaryConfigForm } from '../components/salary/SalaryConfigForm';
import { PayrollTable } from '../components/salary/PayrollTable';
import { useAuth } from '../hooks/useAuth';
import { useSalary, useSalaryActions } from '../hooks/useSalary';
import { salaryApi } from '../api/salary.api';
import { useTranslation } from '../context/LanguageContext';

export default function SalaryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()), bonus: '0', advance: '0' });
  const salary = useSalary(user?.employeeId);
  const actions = useSalaryActions();

  const params = { month: Number(period.month), year: Number(period.year), bonus: Number(period.bonus || 0), advance: Number(period.advance || 0) };

  return (
    <section className="w-full">
      <PageHeader title={t('salary.title')} description={t('salary.subtitle')} />
      <Card>
        <CardHeader title={t('salary.config')} />
        <CardBody><SalaryConfigForm employeeId={user?.employeeId} onSubmit={(payload) => actions.upsertConfig.mutate(payload)} loading={actions.upsertConfig.isPending} /></CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title={t('salary.actions')} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <TextField label={t('salary.month')} type="number" value={period.month} onChange={(event) => setPeriod((prev) => ({ ...prev, month: event.target.value }))} />
            <TextField label={t('salary.year')} type="number" value={period.year} onChange={(event) => setPeriod((prev) => ({ ...prev, year: event.target.value }))} />
            <TextField label={t('salary.bonus')} type="number" value={period.bonus} onChange={(event) => setPeriod((prev) => ({ ...prev, bonus: event.target.value }))} />
            <TextField label={t('salary.advance')} type="number" value={period.advance} onChange={(event) => setPeriod((prev) => ({ ...prev, advance: event.target.value }))} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => user?.employeeId && actions.calculateOne.mutate({ empId: user.employeeId, params })} loading={actions.calculateOne.isPending}>{t('salary.calculateMine')}</Button>
            <Button variant="secondary" onClick={() => actions.calculateAll.mutate(params)} loading={actions.calculateAll.isPending}>{t('salary.calculateAll')}</Button>
            <Button
              variant="secondary"
              icon={<Download className="h-4 w-4" />}
              onClick={async () => {
                const blob = await salaryApi.exportExcel(params.month, params.year);
                const url = URL.createObjectURL(blob);
                window.open(url);
              }}
            >
              {t('salary.exportExcel')}
            </Button>
          </div>
        </CardBody>
      </Card>
      <Card className="mt-5">
        <CardHeader title={t('salary.history')} />
        <CardBody><PayrollTable records={salary.history.data || []} onConfirm={(id) => actions.confirm.mutate(id)} onPaid={(id) => actions.markPaid.mutate(id)} /></CardBody>
      </Card>
    </section>
  );
}
