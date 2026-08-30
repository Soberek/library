import React, { useState, useMemo } from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AuthLayout, Button } from '../components/ui';
import { signUpSchema, type SignUpFormData } from '../schemas';
import { toast } from '../stores';
import { cn } from '../lib/utils';

function resolveRedirectTarget(from: unknown): string {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) {
    return '/';
  }
  if (from === '/sign-in' || from === '/sign-up') {
    return '/';
  }
  return from;
}

export const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  const passwordVal = watch('password') || '';

  // Password strength calculations
  const passwordStrength = useMemo(() => {
    if (!passwordVal) return { score: 0, label: '', color: '', textColor: '' };
    let score = 0;
    if (passwordVal.length >= 6) score += 1;
    if (passwordVal.length >= 8) score += 1;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(passwordVal)) score += 1;
    if (/[A-Z]/.test(passwordVal) && /[a-z]/.test(passwordVal)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Słabe hasło', color: 'bg-rose-500', textColor: 'text-rose-600' };
      case 2:
        return { score: 50, label: 'Średnie hasło', color: 'bg-amber-500', textColor: 'text-amber-600' };
      case 3:
        return { score: 75, label: 'Dobre hasło', color: 'bg-indigo-500', textColor: 'text-indigo-600' };
      case 4:
        return { score: 100, label: 'Bardzo silne hasło', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
      default:
        return { score: 0, label: '', color: '', textColor: '' };
    }
  }, [passwordVal]);

  const hasMinLength = passwordVal.length >= 6;
  const hasSpecialOrNumber = /[0-9!@#$%^&*(),.?":{}|<>]/.test(passwordVal);

  if (authContext.user?.uid) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (data: SignUpFormData) => {
    clearErrors();
    setLocalError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Konto zostało utworzone pomyślnie! Witamy w MyLibrary.');
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      let message = 'Wystąpił nieznany błąd podczas rejestracji.';
      if (err instanceof Error) {
        const errStr = err.message.toLowerCase();
        if (errStr.includes('email-already-in-use')) {
          message = 'Ten adres email jest już zarejestrowany. Zaloguj się.';
        } else if (errStr.includes('weak-password')) {
          message = 'Hasło jest zbyt słabe (musi zawierać co najmniej 6 znaków).';
        } else if (errStr.includes('invalid-email')) {
          message = 'Niepoprawny format adresu email.';
        } else {
          message = err.message;
        }
      }
      setLocalError(message);
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Dołącz do MyLibrary"
      subtitle="Stwórz bezpłatne konto, aby organizować książki i filmy w jednym miejscu."
      footer={
        <p className="text-xs text-slate-500">
          Masz już konto?{' '}
          <Link
            to="/sign-in"
            state={{ from: redirectTo === '/' ? undefined : redirectTo }}
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1 group"
          >
            <span>Zaloguj się</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Error alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in-0 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-xs font-bold text-slate-700 mb-1.5"
          >
            Adres email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="twoj@email.com"
              aria-invalid={Boolean(errors.email)}
              className={cn(
                'flex h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3',
                errors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15',
              )}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-xs font-bold text-slate-700 mb-1.5"
          >
            Hasło <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimum 6 znaków"
              aria-invalid={Boolean(errors.password)}
              className={cn(
                'flex h-11 w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3',
                errors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15',
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
              <span>{errors.password.message}</span>
            </p>
          )}

          {/* Password Strength Meter */}
          {passwordVal && (
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Siła hasła:</span>
                <span className={cn('font-bold', passwordStrength.textColor)}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-300 rounded-full', passwordStrength.color)}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            </div>
          )}

          {/* Password checklist */}
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors shrink-0',
                  hasMinLength
                    ? 'bg-emerald-100 text-emerald-700 font-bold'
                    : 'bg-slate-100 text-slate-400',
                )}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className={cn(hasMinLength && 'text-slate-700 font-medium')}>
                Min. 6 znaków
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors shrink-0',
                  hasSpecialOrNumber
                    ? 'bg-emerald-100 text-emerald-700 font-bold'
                    : 'bg-slate-100 text-slate-400',
                )}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className={cn(hasSpecialOrNumber && 'text-slate-700 font-medium')}>
                Cyfra lub znak specjalny
              </span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-tight">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            Rejestrując się, otrzymujesz pełny dostęp do katalogowania książek i filmów w chmurze.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Tworzenie konta…' : 'Zarejestruj się'}</span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
