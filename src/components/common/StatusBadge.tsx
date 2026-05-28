const palette: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIVE: { bg: 'bg-[rgba(195,192,255,0.2)] border-[rgba(195,192,255,0.35)]', text: 'text-[#7b77d9]', dot: 'bg-[#7b77d9]' },
  OPEN: { bg: 'bg-[rgba(195,192,255,0.2)] border-[rgba(195,192,255,0.35)]', text: 'text-[#7b77d9]', dot: 'bg-[#7b77d9]' },
  APPROVED: { bg: 'bg-[rgba(195,192,255,0.2)] border-[rgba(195,192,255,0.35)]', text: 'text-[#7b77d9]', dot: 'bg-[#7b77d9]' },
  PAID: { bg: 'bg-[rgba(208,225,251,0.2)] border-[rgba(208,225,251,0.35)]', text: 'text-[#5680b8]', dot: 'bg-[#5680b8]' },
  PENDING: { bg: 'bg-[rgba(255,219,204,0.2)] border-[rgba(255,219,204,0.35)]', text: 'text-[#d98d6a]', dot: 'bg-[#d98d6a]' },
  DRAFT: { bg: 'bg-[rgba(255,219,204,0.2)] border-[rgba(255,219,204,0.35)]', text: 'text-[#d98d6a]', dot: 'bg-[#d98d6a]' },
  CONFIRMED: { bg: 'bg-[rgba(208,225,251,0.2)] border-[rgba(208,225,251,0.35)]', text: 'text-[#5680b8]', dot: 'bg-[#5680b8]' },
  RESIGNED: { bg: 'bg-[#e4e1eb] border-[rgba(200,196,213,0.4)]', text: 'text-[#58566a]', dot: 'bg-[#58566a]' },
  CLOSED: { bg: 'bg-[#e4e1eb] border-[rgba(200,196,213,0.4)]', text: 'text-[#58566a]', dot: 'bg-[#58566a]' },
  REJECTED: { bg: 'bg-[#fdecec] border-[#f8c9c9]', text: 'text-[#b42318]', dot: 'bg-[#b42318]' },
};

export function StatusBadge({ status }: { status?: string }) {
  const value = status || 'UNKNOWN';
  const config = palette[value] || {
    bg: 'bg-surface-2 border-border',
    text: 'text-muted',
    dot: 'bg-muted',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {value}
    </span>
  );
}
