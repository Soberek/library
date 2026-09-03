import React, { useState } from 'react';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
} from 'lucide-react';
import { AuthLayout, Button, Input, ResetPasswordModal } from '../components/ui';
import { signInSchema, type SignInFormData } from '../schemas';
import { toast } from '../stores';

function resolveRedirectTarget(from: unknown): string {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) {
    return '/';
  }
  if (from === '/sign-in' || from === '/sign-up') {
    return '/';
  }
  return from;
}

export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useAuth();
  const currentEmail = watch('email') || '';

  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  const onSubmit = async (data: SignInFormData) => {
    setErrorMessage(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Zalogowano pomyślnie! Witaj ponownie.');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      let message = 'Wystąpił błąd podczas logowania.';
      if (error instanceof Error) {
        const errStr = error.message.toLowerCase();
        if (
          errStr.includes('user-not-found') ||
          errStr.includes('wrong-password') ||
          errStr.includes('invalid-credential')
        ) {
          message = 'Nieprawidłowy adres email lub hasło.';
        } else if (errStr.includes('too-many-requests')) {
          message = 'Zbyt wiele nieudanych prób. Odczekaj chwilę przed kolejną próbą.';
        } else if (errStr.includes('invalid-email')) {
          message = 'Niepoprawny format adresu email.';
        } else {
          message = error.message;
        }
      }
      setErrorMessage(message);
      toast.error(message);
    }
  };

  if (userContext.user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <>
      <AuthLayout
        title="Witaj ponownie!"
        subtitle="Zaloguj się, aby zarządzać swoją biblioteką i odkrywać nowe pozycje."
        footer={
          <p className="text-xs text-slate-500">
            Nie posiadasz jeszcze konta?{' '}
            <Link
              to="/sign-up"
              state={{ from: redirectTo === '/' ? undefined : redirectTo }}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1 group"
            >
              <span>Zarejestruj się za darmo</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <Input
            id="signin-email"
            type="email"
            label="Adres email"
            required
            autoComplete="email"
            placeholder="twoj@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            inputSize="default"
            {...register('email')}
          />

          {/* Password Field */}
          <Input
            id="signin-password"
            type="password"
            showPasswordToggle
            label="Hasło"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            labelRight={
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={() => setIsResetModalOpen(true)}
                className="p-0 h-auto font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Zapomniałeś hasła?
              </Button>
            }
            error={errors.password?.message}
            inputSize="default"
            {...register('password')}
          />

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in-0 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              loading={isSubmitting}
              loadingText="Logowanie do konta…"
              leftIcon={<LogIn className="w-4 h-4" />}
              fullWidth
              size="lg"
              className="shadow-md hover:shadow-lg gap-2"
            >
              Zaloguj się
            </Button>
          </div>
        </form>
      </AuthLayout>

      {/* Password Reset Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        defaultEmail={currentEmail}
      />
    </>
  );
};

export default SignIn;
