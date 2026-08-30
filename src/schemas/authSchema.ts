import { z } from 'zod';

const emailSchema = z
  .string()
  .min(1, 'Adres email jest wymagany')
  .transform((val) => val.trim().toLowerCase())
  .pipe(z.string().email('Wprowadź poprawny adres email'));

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Hasło jest wymagane')
    .min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Hasło jest wymagane')
    .min(6, 'Hasło musi mieć co najmniej 6 znaków')
    .regex(
      /[0-9!@#$%^&*(),.?":{}|<>]/,
      'Hasło powinno zawierać co najmniej jedną cyfrę lub znak specjalny',
    ),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
