import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
}

export function TextField({
  label,
  error,
  className = '',
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a] dark:text-[#9490a8]">{label}</span>
      <input
        className={`h-10 w-full rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1c1a29] px-3 text-sm text-[#1b1b22] dark:text-[#e2e8f0] outline-none transition-all duration-200 placeholder:text-[#8a8898] dark:placeholder:text-[#5a5670] focus:border-[#1f108e] dark:focus:border-[#7c6ff5] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] dark:focus:ring-[rgba(124,111,245,0.2)] disabled:opacity-60 disabled:cursor-not-allowed ${error ? 'border-[#b42318] dark:border-[#ef4444] focus:ring-[rgba(180,35,24,0.2)] dark:focus:ring-[rgba(239,68,68,0.2)]' : ''} ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-[#b42318] dark:text-[#f87171]">{error}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  className = '',
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a] dark:text-[#9490a8]">{label}</span>
      <textarea
        className={`min-h-24 w-full rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1c1a29] px-3 py-2.5 text-sm text-[#1b1b22] dark:text-[#e2e8f0] outline-none transition-all duration-200 placeholder:text-[#8a8898] dark:placeholder:text-[#5a5670] focus:border-[#1f108e] dark:focus:border-[#7c6ff5] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] dark:focus:ring-[rgba(124,111,245,0.2)] ${error ? 'border-[#b42318] dark:border-[#ef4444] focus:ring-[rgba(180,35,24,0.2)] dark:focus:ring-[rgba(239,68,68,0.2)]' : ''} ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-[#b42318] dark:text-[#f87171]">{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  error,
  className = '',
  children,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a] dark:text-[#9490a8]">{label}</span>
      <select
        className={`h-10 w-full rounded-lg border border-[#c8c4d5] dark:border-[#2e2a3d] bg-white dark:bg-[#1c1a29] px-3 text-sm text-[#1b1b22] dark:text-[#e2e8f0] outline-none transition-all duration-200 focus:border-[#1f108e] dark:focus:border-[#7c6ff5] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)] dark:focus:ring-[rgba(124,111,245,0.2)] ${error ? 'border-[#b42318] dark:border-[#ef4444] focus:ring-[rgba(180,35,24,0.2)] dark:focus:ring-[rgba(239,68,68,0.2)]' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-[#b42318] dark:text-[#f87171]">{error}</span>}
    </label>
  );
}
