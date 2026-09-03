import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from './modal';
import { Button } from './button';
import { Input } from './input';
import { Mail, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas';
import { toast } from '../../stores';

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
              fullWidth
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

          <Input
            id="reset-email"
            type="email"
            label="Adres email konta"
            placeholder="twoj@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              size="sm"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              loadingText="Wysyłanie..."
              leftIcon={<Mail className="w-3.5 h-3.5" />}
              size="sm"
              className="font-bold gap-2"
            >
              Wyślij link resetujący
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ResetPasswordModal;
