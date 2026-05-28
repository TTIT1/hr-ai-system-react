import { Edit, UserMinus } from 'lucide-react';
import { DataTable, type Column } from '../common/DataTable';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import type { Employee } from '../../types/employee.type';

export function EmployeeTable({ employees, onEdit, onResign }: { employees: Employee[]; onEdit: (employee: Employee) => void; onResign: (id: string) => void }) {
  const columns: Column<Employee>[] = [
    { header: 'Name', accessor: (row) => <div><p className="font-medium">{row.full_name}</p><p className="text-xs text-muted">{row.email}</p></div> },
    { header: 'Department', accessor: 'department_id' },
    { header: 'Position', accessor: 'position' },
    { header: 'Level', accessor: 'level' },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="h-8 px-2" onClick={() => onEdit(row)} aria-label="Edit employee">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="danger" className="h-8 px-2" onClick={() => onResign(row.id)} aria-label="Resign employee">
            <UserMinus className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  return <DataTable data={employees} columns={columns} keyField="id" emptyText="No employees found" />;
}
