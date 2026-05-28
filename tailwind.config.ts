import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark base palette
        canvas: '#0a0d14',
        surface: '#111827',
        'surface-2': '#1a2235',
        'surface-3': '#1f2d40',
        border: '#1e2d42',
        'border-light': '#253347',
        // Text
        ink: '#f0f4ff',
        'ink-2': '#b8c5dc',
        muted: '#6b7fa3',
        // Brand / accent
        brand: '#3b82f6',
        'brand-dim': '#1d4ed8',
        'brand-glow': 'rgba(59,130,246,0.18)',
        accent: '#8b5cf6',
        'accent-dim': '#6d28d9',
        cyan: '#06b6d4',
        emerald: '#10b981',
        // Status
        success: '#10b981',
        warn: '#f59e0b',
        danger: '#ef4444',
        // Legacy aliases for components that reference old tokens
        line: '#1e2d42',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-dark': 'linear-gradient(180deg, #111827 0%, #0a0d14 100%)',
        'gradient-card': 'linear-gradient(135deg, #1a2235 0%, #1f2d40 100%)',
        'gradient-glow': 'radial-gradient(ellipse at top, rgba(59,130,246,0.12) 0%, transparent 60%)',
      },
      boxShadow: {
        'panel': '0 0 0 1px rgba(59,130,246,0.08), 0 8px 32px rgba(0,0,0,0.4)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.3)',
        'glow-brand': '0 0 24px rgba(59,130,246,0.25)',
        'glow-accent': '0 0 24px rgba(139,92,246,0.25)',
        'nav-active': 'inset 3px 0 0 #3b82f6',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
