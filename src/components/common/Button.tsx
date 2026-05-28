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
    'border-[#1f108e] bg-[#1f108e] text-white hover:bg-[#2b1ca0] dark:border-[#4f46e5] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca]',
  secondary:
    'border-[#c8c4d5] bg-white text-[#1b1b22] hover:bg-[#f6f2fc] dark:border-[#2e2a3d] dark:bg-[#1a1826] dark:text-[#e8e4f0] dark:hover:bg-[#252235]',
  danger:
    'border-[#fecaca] bg-[#fff0f0] text-[#b42318] hover:bg-[#b42318] hover:text-white dark:border-[#7f1d1d] dark:bg-[#2d1313] dark:text-[#f87171] dark:hover:bg-[#ef4444] dark:hover:text-white',
  ghost:
    'border-transparent bg-transparent text-[#464553] hover:bg-[#f6f2fc] hover:text-[#1b1b22] dark:text-[#9490a8] dark:hover:bg-[#252235] dark:hover:text-[#e8e4f0]',
  outline:
    'border-[#c8c4d5] bg-transparent text-[#1f108e] hover:border-[#1f108e] hover:bg-[#f6f2fc] dark:border-[#2e2a3d] dark:text-[#a78bfa] dark:hover:border-[#7c6ff5] dark:hover:bg-[#252235]',
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
