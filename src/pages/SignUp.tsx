import React, { useState, useMemo } from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Mail,
  Lock,
  UserPlus,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AuthLayout, Button, Input } from '../components/ui';
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
        <Input
          id="signup-email"
          type="email"
          label="Adres email"
          required
          autoComplete="email"
          placeholder="twoj@email.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Field */}
        <div>
          <Input
            id="signup-password"
            type="password"
            showPasswordToggle
            label="Hasło"
            required
            autoComplete="new-password"
            placeholder="Minimum 6 znaków"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

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
            loading={isSubmitting}
            loadingText="Tworzenie konta…"
            leftIcon={<UserPlus className="w-4 h-4" />}
            fullWidth
            size="lg"
            className="shadow-md hover:shadow-lg gap-2"
          >
            Zarejestruj się
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
