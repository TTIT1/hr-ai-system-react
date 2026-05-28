export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`relative overflow-hidden rounded-lg border border-[#c8c4d5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[#c8c4d5] px-5 py-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-[#8a8898]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

/** Stat card with colored accent border-top */
export function StatCard({
  label,
  value,
  icon,
  trend,
  variant = 'blue',
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'blue' | 'purple' | 'emerald' | 'amber';
}) {
  const cls = {
    blue: '',
    purple: '',
    emerald: '',
    amber: '',
  }[variant];

  const iconCls = {
    blue: 'text-[#1f108e] bg-[rgba(55,48,163,0.1)]',
    purple: 'text-[#5b34b8] bg-[rgba(91,52,184,0.12)]',
    emerald: 'text-[#0f766e] bg-[rgba(15,118,110,0.12)]',
    amber: 'text-[#b45309] bg-[rgba(180,83,9,0.12)]',
  }[variant];

  return (
    <div className={`rounded-lg border border-[#c8c4d5] bg-white p-5 ${cls}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#464553]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#1b1b22]">{value}</p>
          {trend && <p className="mt-1 text-xs text-[#5f5d70]">{trend}</p>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconCls}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
