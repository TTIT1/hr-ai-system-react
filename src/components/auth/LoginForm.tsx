import { useState } from 'react';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../context/LanguageContext';

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.email.trim()) next.email = t('login.emailRequired');
    if (!form.password) next.password = t('login.passwordRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (validate()) login.mutate(form);
      }}
    >
      {/* Email */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
          {t('login.email')}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="you@company.com"
          className={`h-11 w-full rounded-xl border bg-surface-2 px-4 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/40 focus:ring-2 focus:ring-brand/30 ${
            errors.email
              ? 'border-danger focus:border-danger'
              : 'border-border focus:border-brand focus:bg-surface-3'
          }`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-danger">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
          {t('login.password')}
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className={`h-11 w-full rounded-xl border bg-surface-2 px-4 pr-11 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/40 focus:ring-2 focus:ring-brand/30 ${
              errors.password
                ? 'border-danger focus:border-danger'
                : 'border-border focus:border-brand focus:bg-surface-3'
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
        )}
      </div>

      <Button
        id="login-submit"
        type="submit"
        className="w-full"
        size="lg"
        loading={login.isPending}
        icon={<LogIn className="h-4 w-4" />}
      >
        {login.isPending ? t('login.signingIn') : t('login.signIn')}
      </Button>

      <p className="text-center text-xs text-muted">
        {t('login.securedBy')}{' '}
        <span className="inline-flex items-center gap-1 font-medium text-brand">
          <Sparkles className="h-3 w-3" /> HR AI System
        </span>
      </p>
    </form>
  );
}
