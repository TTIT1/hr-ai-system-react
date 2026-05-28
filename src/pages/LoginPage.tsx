import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Briefcase,
  CalendarCheck,
  Sparkles,
  Users,
  WalletCards,
  Globe,
} from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../context/LanguageContext';

const features = [
  { icon: Users, label: 'Employee Management', desc: 'Profiles, departments & org structure' },
  { icon: CalendarCheck, label: 'Attendance & Leave', desc: 'Real-time tracking and approvals' },
  { icon: WalletCards, label: 'Payroll Engine', desc: 'Auto-calculate, confirm and export' },
  { icon: Briefcase, label: 'Recruitment Pipeline', desc: 'Track candidates from apply to hire' },
  { icon: Bot, label: 'AI HR Assistant', desc: 'Natural language HR query engine' },
];

export default function LoginPage() {
  const { t, language, setLanguage } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-canvas">
      {/* ─── Left panel ─── */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-12 lg:flex">
        {/* Background gradient blob */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="avatar-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-glow-brand">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="gradient-text text-sm font-bold">HR AI System</p>
              <p className="text-[10px] uppercase tracking-widest text-muted">Enterprise Console</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
            {t('login.unifiedLabel')}
          </p>
          <h1 className="text-5xl font-extrabold leading-tight text-ink">
            {t('login.unifiedTitle')}<br />
            <span className="gradient-text">{t('login.unifiedTitle2')}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2/70">
            {t('login.unifiedDesc')}
          </p>

          {/* Feature pills */}
          <div className="mt-8 grid gap-3">
            {features.map((f, i) => {
              const labelKey = `login.feature${i + 1}Label`;
              const descKey = `login.feature${i + 1}Desc`;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 backdrop-blur"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                    <f.icon className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t(labelKey)}</p>
                    <p className="text-xs text-muted">{t(descKey)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} HR AI System. {t('sidebar.enterprise')}.
          </p>
        </motion.div>
      </div>

      {/* ─── Divider ─── */}
      <div className="hidden w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

      {/* ─── Right panel (form) ─── */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 lg:w-[480px] lg:flex-none">
        {/* Language Switcher absolute positioned at top right */}
        <div className="absolute right-6 top-6 z-50">
          <div className="relative group">
            <button className="flex items-center gap-1.5 rounded-xl border border-[#c8c4d5] bg-white px-3 py-2 text-xs font-bold text-[#464553] transition hover:bg-[#ede8f7] focus:outline-none shadow-sm">
              <Globe className="h-4 w-4 text-[#1f108e]" />
              <span className="tracking-wider">
                {language === 'en' ? 'EN' : language === 'vi' ? 'VI' : 'ZH'}
              </span>
            </button>
            
            <div className="absolute right-0 top-full z-[9999] mt-1 hidden w-32 rounded-xl border border-[#c8c4d5] bg-white p-1.5 shadow-lg group-hover:block hover:block animate-in fade-in slide-in-from-top-1 duration-200">
              <button
                onClick={() => setLanguage('en')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                  language === 'en' ? 'bg-[rgba(55,48,163,0.1)] text-[#1f108e]' : 'text-[#464553] hover:bg-[#ede8f7]'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLanguage('vi')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                  language === 'vi' ? 'bg-[rgba(55,48,163,0.1)] text-[#1f108e]' : 'text-[#464553] hover:bg-[#ede8f7]'
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                  language === 'zh' ? 'bg-[rgba(55,48,163,0.1)] text-[#1f108e]' : 'text-[#464553] hover:bg-[#ede8f7]'
                }`}
              >
                🇨🇳 中文 (简体)
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="avatar-gradient flex h-9 w-9 items-center justify-center rounded-xl">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <p className="gradient-text text-sm font-bold">HR AI System</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink">{t('login.signInTitle')}</h2>
            <p className="mt-2 text-sm text-muted">
              {t('login.signInDesc')}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-panel">
            {/* Top gradient line */}
            <div className="mb-6 h-px bg-gradient-to-r from-brand via-accent to-transparent" />
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
