import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, UserPlus, Check } from "lucide-react";
import AuthLayout from "../components/ui/AuthLayout";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

type FormData = {
  email: string;
  password: string;
};

function resolveRedirectTarget(from: unknown): string {
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }
  if (from === "/sign-in" || from === "/sign-up") {
    return "/";
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
  } = useForm<FormData>();
  const [error, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  const passwordVal = watch("password") || "";

  if (authContext.user?.uid) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (data: FormData) => {
    clearErrors();
    setLocalError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errStr = err.message.toLowerCase();
        if (errStr.includes("email-already-in-use")) {
          setLocalError("Ten adres email jest już zarejestrowany. Zaloguj się.");
        } else if (errStr.includes("weak-password")) {
          setLocalError("Hasło jest zbyt słabe (musi zawierać co najmniej 6 znaków).");
        } else {
          setLocalError(err.message);
        }
      } else {
        setLocalError("Wystąpił nieznany błąd podczas rejestracji.");
      }
    }
  };

  return (
    <AuthLayout
      title="Dołącz do MyLibrary"
      subtitle="Stwórz bezpłatne konto i organizuj swoje zbiory książek oraz filmów."
      footer={
        <p className="text-xs text-slate-500">
          Masz już konto?{" "}
          <Link
            to="/sign-in"
            state={{ from: redirectTo === "/" ? undefined : redirectTo }}
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Adres email *
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
              className={cn(
                "flex h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15"
              )}
              {...register("email", {
                required: "Email jest wymagany",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Nieprawidłowy format adresu email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 mb-1.5">
            Hasło *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 6 znaków"
              className={cn(
                "flex h-11 w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3",
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15"
              )}
              {...register("password", {
                required: "Hasło jest wymagane",
                minLength: {
                  value: 6,
                  message: "Hasło musi mieć co najmniej 6 znaków",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.password.message}</p>
          )}

          {/* Password strength checklist */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]",
                  passwordVal.length >= 6 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                )}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Minimum 6 znaków</span>
            </div>
          </div>
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
            <span>{isSubmitting ? "Tworzenie konta…" : "Zarejestruj się"}</span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
