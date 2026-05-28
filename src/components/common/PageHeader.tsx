export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[44px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1b1b22]">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#464553]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
