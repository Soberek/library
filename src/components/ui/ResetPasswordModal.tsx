import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from './modal';
import { Button } from './button';
import { Mail, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas';
import { toast } from '../../stores';
import { cn } from '../../lib/utils';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const currentEmail = watch('email');

  useEffect(() => {
    if (isOpen) {
      setValue('email', defaultEmail);
      setError(null);
      setSuccess(false);
    } else {
      reset();
    }
  }, [isOpen, defaultEmail, setValue, reset]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccess(true);
      toast.success('Wysłano link do resetowania hasła.');
    } catch (err: unknown) {
      let message = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
      if (err instanceof Error) {
        const errStr = err.message.toLowerCase();
        if (errStr.includes('user-not-found')) {
          message = 'Nie znaleziono konta powiązanego z tym adresem email.';
        } else if (errStr.includes('invalid-email')) {
          message = 'Podany adres email jest nieprawidłowy.';
        } else {
          message = err.message;
        }
      }
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span>Resetowanie hasła</span>
        </div>
      }
      description="Podaj adres email powiązany z Twoim kontem, a wyślemy Ci link do ustawienia nowego hasła."
    >
      {success ? (
        <div className="py-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Sprawdź swoją skrzynkę!</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Wysłaliśmy wiadomość z instrukcją resetowania hasła na adres{' '}
              <strong className="text-slate-800 font-semibold">{currentEmail}</strong>.
            </p>
          </div>
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full"
            >
              Rozumiem, zamknij
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2" noValidate>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="reset-email" className="block text-xs font-bold text-slate-700 mb-1.5">
              Adres email konta
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                placeholder="twoj@email.com"
                aria-invalid={Boolean(errors.email)}
                className={cn(
                  'flex h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3 border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15',
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

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5" />
              )}
              <span>{isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetujący'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ResetPasswordModal;
