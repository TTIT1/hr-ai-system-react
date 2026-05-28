import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SelectField, TextField } from '../components/common/FormField';
import { useUserRoleActions } from '../hooks/useUserRole';
import { useTranslation } from '../context/LanguageContext';
import type { Role } from '../types/common.type';

const roles: Role[] = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];

export default function UserRolePage() {
  const { t } = useTranslation();
  const actions = useUserRoleActions();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<Role>('EMPLOYEE');

  return (
    <section className="w-full">
      <PageHeader title={t('modules.userRolesTitle')} description={t('modules.userRolesDesc')} />
      <Card>
        <CardHeader title={t('modules.updateUserRole')} description={t('modules.userRoleHelp')} />
        <CardBody className="grid gap-4 md:grid-cols-2">
          <TextField label={t('modules.userId')} value={userId} onChange={(event) => setUserId(event.target.value)} />
          <SelectField label={t('modules.role')} value={role} onChange={(event) => setRole(event.target.value as Role)}>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </SelectField>
          <div className="md:col-span-2">
            <Button disabled={!userId.trim()} loading={actions.update.isPending} onClick={() => actions.update.mutate({ userId: userId.trim(), role })}>
              {t('modules.updateRole')}
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
