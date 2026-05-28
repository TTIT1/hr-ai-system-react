import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[#1f108e] text-white border-[#1f108e] hover:bg-[#2b1ca0]',
  secondary:
    'bg-white text-[#1b1b22] border-[#c8c4d5] hover:bg-[#f6f2fc]',
  danger:
    'bg-[#fff0f0] text-[#b42318] border-[#fecaca] hover:bg-[#b42318] hover:text-white',
  ghost:
    'bg-transparent text-[#464553] border-transparent hover:bg-[#f6f2fc] hover:text-[#1b1b22]',
  outline:
    'bg-transparent text-[#1f108e] border-[#c8c4d5] hover:bg-[#f6f2fc] hover:border-[#1f108e]',
};

const sizes: Record<string, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  loading,
  icon,
  disabled,
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
